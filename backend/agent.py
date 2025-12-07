import os
from dotenv import load_dotenv
from typing import List, Optional
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field
from models import ActionItem, AgentState, DecisionWithAttribution


load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0)


# --- AGENT 1: Decision and Topic Classifier ---
class DecisionTopicClassifier:
    def __init__(self):
        class DecisionsTopics(BaseModel):
            key_decisions: List[DecisionWithAttribution] = Field(..., description="A list of all final, binding decisions made and who proposed them")
            key_topics: List[str] = Field(..., description="A list of 3-5 major discussion subjects")

        self.parser = JsonOutputParser(pydantic_object=DecisionsTopics)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are an 'Attribution Classifier Agent'. Your job is to analyze the transcript and extract the high-level key resolutions, final decisions and definitive instructions that finalize a course of action. For every decision/instruction, you MUST identify the person who stated it (the speaker). If the speaker is not explicitly named, do not name them. You MUST adhere to the provided JSON structure"),
            ("user", "Transcript:\n{transcript}\n\n{format_instructions}"),
        ])
        self.chain = self.prompt | llm | self.parser

    async def classify(self, state: AgentState) -> dict:
        print("-> Running Decision & Topic Classifier...")
        transcript = state["transcript"]
        format_instructions = self.parser.get_format_instructions()
        result = await self.chain.ainvoke({"transcript": transcript, "format_instructions": format_instructions})
        return {"decisions_and_topics": result}


# --- AGENT 2: Raw Action Item Extractor ---
class RawActionItemExtractor:
    def __init__(self):
        class RawActionItems(BaseModel):
            raw_action_items: List[str] = Field(..., description="A list of raw sentences from the transcript that imply a future action, task, or follow-up is required. Include announcements for future meetings or events")

        self.parser = JsonOutputParser(pydantic_object=RawActionItems)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are an 'Raw Action Item Extractor Agent'. Your job is to extract EVERY sentence from the transcript that indicates a required follow-up, task, assignment, or action, whether it is explicit or implied by a speaker. Include scheduled events. Do not invent or misspell technical terms, repo names or directory names. Capture them exactly as spoken! Do not summarize or change the sentences. Only return the exact sentences. You MUST adhere to the provided JSON structure"),
            ("user", "Transcript:\n{transcript}\n\n{format_instructions}"),
        ])
        self.chain = self.prompt | llm | self.parser

    async def extract(self, state: AgentState) -> dict:
        print("-> Running Raw Action Item Extractor...")
        transcript = state["transcript"]
        format_instructions = self.parser.get_format_instructions()
        result = await self.chain.ainvoke({"transcript": transcript, "format_instructions": format_instructions})
        return {"raw_action_items": result["raw_action_items"]}


# --- AGENT 3: Action Item Structurer ---
class ActionItemStructurer:
    """Agent specialized in structuring, detecting speakers and detecting deadlines"""
    def __init__(self):

        class StructuredActionItems(BaseModel):
            action_items: List[ActionItem] = Field(..., description="The final list of structured action items")

        self.parser = JsonOutputParser(pydantic_object=StructuredActionItems)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are a 'Structurer Agent'. Your job is to take raw, unstructured action item sentences and structure them into clear Tasks, Deadlines, and Speaker attribution. CRITICALLY: Ignore and discard any sentence that is pure meta-dialogue, conversational filler, or nonsensical/garbled text. If you encounter minor spelling errors in directory/repo names, correct them to the likely intended, professional names. The Speaker must be the person or role who assigned the task. You MUST extract the Speaker names from the transcript. Set the Deadline to null if not explicit. You MUST adhere to the provided JSON structure"),
            ("user", "Raw Action Item Sentences:\n{raw_action_items}\n\n{format_instructions}"),
        ])
        self.chain = self.prompt | llm | self.parser

    async def structure(self, state: AgentState) -> dict:
        print("-> Running Action Item Structurer...")
        raw_action_items = "\n".join(state["raw_action_items"])
        format_instructions = self.parser.get_format_instructions()
        result = await self.chain.ainvoke({"raw_action_items": raw_action_items, "format_instructions": format_instructions})
        if not isinstance(result, dict) or "action_items" not in result:
            print(f"WARNING: Structurer failed to return dictionary. Actual type: {type(result)}")
            return {"action_items": []}
        return {"action_items": result["action_items"]}


# --- LangGraph Setup ---
async def get_summary_from_transcript(transcript: str):
    classifier = DecisionTopicClassifier()
    extractor = RawActionItemExtractor()
    structurer = ActionItemStructurer()

    workflow = StateGraph(AgentState)

    workflow.add_node("classify", classifier.classify)
    workflow.add_node("extract_raw_actions", extractor.extract)
    workflow.add_node("structure_actions", structurer.structure)

    workflow.set_entry_point("classify")
    workflow.add_edge("classify", "extract_raw_actions")
    workflow.add_edge("extract_raw_actions", "structure_actions")
    workflow.add_edge("structure_actions", END)

    app = workflow.compile()
    final_state = await app.ainvoke({"transcript": transcript})
    final_summary = {
        "key_decisions": final_state["decisions_and_topics"]["key_decisions"],
        "key_topics": final_state["decisions_and_topics"]["key_topics"],
        "action_items": final_state["action_items"]
    }

    return final_summary
