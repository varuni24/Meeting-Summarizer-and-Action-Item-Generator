from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import MeetingTranscript
from agent import get_summary_from_transcript
from fastapi import UploadFile, File
import PyPDF2
import io

app = FastAPI(title="AI Meeting Summarizer API - Multi-Agent")
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Meeting Summarizer API (Multi-Agent) is running"}


@app.post("/summarize")
async def summarize_meeting(data: MeetingTranscript):
    print(f"Received transcript of length: {len(data.transcript)}")
    summary = await get_summary_from_transcript(data.transcript)

    if summary and "error" in summary:
        return {"status": "error", "message": summary["error"]}

    return summary


@app.post("/upload-file")
async def upload_meeting_file(file: UploadFile = File(...)):
    try:
        if file.content_type == "application/pdf":
            contents = await file.read()
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return {"transcript": text, "filename": file.filename}

        elif file.content_type == "text/plain":
            contents = await file.read()
            text = contents.decode("utf-8")
            return {"transcript": text, "filename": file.filename}

        else:
            return {"error": "Unsupported file type... Please upload PDF or TXT files"}

    except Exception as e:
        return {"error": f"Failed to process file: {str(e)}"}
