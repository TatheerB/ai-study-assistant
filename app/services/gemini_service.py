import google.generativeai as genai
import os
import json

# Configure Gemini with your API key from .env
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

def generate_quiz(topic):
    """Generate a 5-question multiple-choice quiz about the given topic"""
    
    prompt = f"""
    Create a 5-question multiple-choice quiz about "{topic}".
    
    For each question, provide:
    - The question text
    - 4 options (A, B, C, D)
    - The correct answer (0 for first option, 1 for second, 2 for third, 3 for fourth)
    
    Format your response as a JSON array. Example:
    [
        {{
            "question": "What is Python?",
            "options": ["A programming language", "A snake", "A car", "A food"],
            "correct": 0
        }}
    ]
    
    Only return the JSON array, no other text.
    """
    
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    response = model.generate_content(prompt)
    
    try:
        quiz_data = json.loads(response.text)
        return quiz_data
    except:
        return [
            {
                "question": f"What is {topic}?",
                "options": ["Definition 1", "Definition 2", "Definition 3", "Definition 4"],
                "correct": 0
            }
        ]