import json
import logging
import re
from app.core.llm import generate_content_async
from app.models.schemas import EventInput, EventCircular

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
🔹 ROLE
You are an AI content-generation agent used in a FastAPI backend system.
Your role is to convert chat-style, unstructured event information provided by a user
into professional, formal textual content suitable for an official college event circular.

🔹 INPUT CHARACTERISTICS:
- Input comes as free-form chat text (similar to ChatGPT input).
- Information may be unordered, informal, or incomplete.
- Do NOT ask follow-up questions.
- If any detail is missing, write "Not Provided".

🔹 CONTENT TO GENERATE:
Generate content for ALL of the following sections:
1. Event Title
2. Date and Time
3. Venue
4. Event Description (formal academic tone, suitable for a college circular)
5. Number of Participants (extract from input if mentioned, otherwise "Not Provided")
6. Event Type (infer from context - e.g., Hackathon, Workshop, Seminar, Competition, Conference, etc. If unclear, use "Not Provided")
7. Duration (extract if mentioned OR calculate from start/end times if provided. Examples: "3 hours", "2 days", "9:00 AM to 6:00 PM" → "9 hours". If cannot determine, use "Not Provided")
8. Rules (bullet-point style text)
9. Judging Criteria (bullet-point style text)
10. Coordinators (list of names)
11. Convenor (single name)

🔹 TONE AND STYLE RULES:
- Use formal, professional, academic language.
- Suitable for an official college circular.
- Avoid casual, promotional, or conversational tone.
- Be concise, clear, and structured.

🔹 OUTPUT FORMAT (STRICT):
Return ONLY valid JSON in the exact structure below.
Do NOT include explanations, markdown, or extra text.

{
  "event_title": "",
  "date_time": "",
  "venue": "",
  "event_description": "",
  "number_of_participants": "",
  "event_type": "",
  "duration": "",
  "rules": [],
  "judging_criteria": [],
  "coordinators": [],
  "convenor": ""
}

🔹 FINAL CONSTRAINTS:
- Output ONLY JSON.
- No markdown.
- No explanations.
- No references to AI, Gemini, FastAPI, Antigravity, or APIs.
"""

async def generate_circular_service(input_data: EventInput) -> EventCircular:
    full_prompt = f"{SYSTEM_PROMPT}\n\nUSER INPUT:\n{input_data.text}"
    
    try:
        response_text = await generate_content_async(full_prompt)
        
        # Clean up potential markdown code blocks
        cleaned_response = response_text.strip()
        cleaned_response = re.sub(r'^```json\s*', '', cleaned_response)
        cleaned_response = re.sub(r'^```\s*', '', cleaned_response)
        cleaned_response = re.sub(r'\s*```$', '', cleaned_response)
        
        json_data = json.loads(cleaned_response)
        return EventCircular(**json_data)
    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error: {e} | Response: {response_text}")
        raise ValueError("Failed to generate valid JSON circular.")
    except Exception as e:
        logger.error(f"Error generating circular: {e}")
        raise e
