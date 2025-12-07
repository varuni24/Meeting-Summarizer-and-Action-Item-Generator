from pydantic import BaseModel, Field
from typing import List, Optional, TypedDict

class AgentState(TypedDict):
    transcript: str
    decisions_and_topics: Optional[dict]
    raw_action_items: Optional[List[str]]
    action_items: Optional[List[dict]]

class ActionItem(BaseModel):
    task: str = Field(..., description="A clear, concise description of the task")
    deadline: Optional[str] = Field(None, description="The implied or stated deadline (e.g., 'Tuesday, July 16 at noon'). Null if not explicit")
    speaker: str = Field(..., description="The person who gave the instruction or assigned the task")

class DecisionWithAttribution(BaseModel):
    decision: str = Field(..., description="The final decision or resolution")
    mover: Optional[str] = Field(None, description="The person who moved the motion or was primarily responsible for the decision. Null if not provided")

class MeetingSummary(BaseModel):
    key_decisions: List[DecisionWithAttribution] = Field(..., description="A list of all final decisions made during the meeting, including the person who moved the motion")
    key_topics: List[str] = Field(..., description="A list of 3-5 main discussion topics or key points")
    action_items: List[ActionItem] = Field(..., description="A list of all structured action items (Task, Owner, Deadline, Speaker)")

class MeetingTranscript(BaseModel):
    """Input model for the API"""
    transcript: str = Field(..., description="The raw text transcript of the meeting")
