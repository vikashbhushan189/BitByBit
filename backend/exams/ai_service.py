import google.generativeai as genai
from django.conf import settings
import json
import PIL.Image

genai.configure(api_key=settings.GEMINI_API_KEY)

def get_model():
    return genai.GenerativeModel('gemini-2.5-flash')

def clean_json_response(response_text):
    clean_text = response_text.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError:
        return []

def generate_questions_from_text(text_content, num_questions=5, difficulty="Medium", custom_instructions=""):
    model = get_model()
    
    style_guide = custom_instructions if custom_instructions else "General Competitive Exam standards"

    prompt = f"""
    Act as an expert exam setter.
    CONTEXT: {style_guide}
    TASK: Generate {num_questions} Multiple Choice Questions (MCQ) based on the notes.
    DIFFICULTY: {difficulty}
    
    STRICT JSON OUTPUT FORMAT:
    [
        {{
            "question_text": "Question...",
            "options": ["A", "B", "C", "D"],
            "correct_index": 0,
            "marks": 2,
            "explanation": "Detailed explanation of why this option is correct..."
        }}
    ]
    
    NOTES:
    {text_content[:25000]} 
    """
    
    try:
        response = model.generate_content(prompt)
        return clean_json_response(response.text)
    except Exception as e:
        print(f"Text AI Error: {e}")
        return []

def generate_question_from_image(image_file, difficulty="Medium", custom_instructions=""):
    model = get_model()
    img = PIL.Image.open(image_file)
    style_guide = custom_instructions if custom_instructions else "standard exam pattern"

    prompt = f"""
    Analyze this image.
    TASK: Create 1 Multiple Choice Question (MCQ) based on it.
    CONTEXT: {style_guide}
    DIFFICULTY: {difficulty}
    
    STRICT JSON OUTPUT FORMAT (Array of 1 object):
    [
        {{
            "question_text": "Question...",
            "options": ["A", "B", "C", "D"],
            "correct_index": 0,
            "marks": 2,
            "explanation": "Detailed explanation..."
        }}
    ]
    """

    try:
        response = model.generate_content([prompt, img])
        return clean_json_response(response.text)
    except Exception as e:
        print(f"Vision AI Error: {e}")
        return []