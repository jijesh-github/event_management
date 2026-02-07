from pydantic import BaseModel, Field
from typing import List

class EventInput(BaseModel):
    text: str = Field(..., description="Unstructured event details from chat")

class EventCircular(BaseModel):
    event_title: str = Field(..., description="Title of the event")
    date_time: str = Field(..., description="Date and Time")
    venue: str = Field(..., description="Venue location")
    event_description: str = Field(..., description="Formal academic description")
    number_of_participants: str = Field(..., description="Number of participants or participation details")
    event_type: str = Field(..., description="Type of event (e.g., Hackathon, Workshop, Seminar, Competition)")
    duration: str = Field(..., description="Duration of the event")
    rules: List[str] = Field(..., description="List of rules")
    judging_criteria: List[str] = Field(..., description="List of judging criteria")
    coordinators: List[str] = Field(..., description="List of coordinators")
    convenor: str = Field(..., description="Name of the convenor")
