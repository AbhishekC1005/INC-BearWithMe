import os
import sys
from app.config import settings

if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your-gemini-api-key-here":
    print("NO API KEY SET IN .env")
    sys.exit(1)

from google import genai

client = genai.Client(api_key=settings.GEMINI_API_KEY)

gemini_messages = [
    {"role": "user", "parts": [{"text": "System prompt"}]},
    {"role": "model", "parts": [{"text": "Hello"}]},
    {"role": "user", "parts": [{"text": "How are you?"}]}
]

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=gemini_messages,
    )
    print("SUCCESS")
    print(response.text)
except Exception as e:
    import traceback
    with open("error.txt", "w", encoding="utf-8") as f:
        f.write(traceback.format_exc())
