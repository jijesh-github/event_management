import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def get_model():
    return genai.GenerativeModel(settings.MODEL_NAME)

async def generate_content_async(prompt: str) -> str:
    model = get_model()
    response = await model.generate_content_async(prompt)
    return response.text
