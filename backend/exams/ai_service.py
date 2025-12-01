import google.generativeai as genai
from django.conf import settings
import json

# Configure the API
genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_questions_from_text(text_content, num_questions=5, difficulty="Medium"):
    # FIX: Updated to the latest 2025 model version
    model = genai.GenerativeModel('gemini-2.5-flash')

    # 2. Craft the Prompt
    prompt = f"""
    You are an expert exam setter for competitive exams.
    Based on the following text notes, generate {num_questions} {difficulty} level Multiple Choice Questions (MCQ).
    
    The output MUST be a valid JSON array. Do not include markdown formatting like ```json ... ```.
    Each object in the array must have:
    - "question_text": String
    - "options": Array of 4 strings
    - "correct_index": Integer (0-3)
    - "marks": Integer (Default to 2)
    
    Here are the notes:
    {text_content}
    """

    # 3. Call AI
    try:
        response = model.generate_content(prompt)
        # Clean up response if AI adds markdown code blocks
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"AI Error: {e}")
        # Return a fallback error question so the UI doesn't crash
        return [{
            "question_text": "Error generating questions. Please try again.",
            "options": ["Error", "Error", "Error", "Error"],
            "correct_index": 0,
            "marks": 0
        }]