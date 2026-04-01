import os
import json
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise EnvironmentError("GEMINI_API_KEY is not set in your .env file")


def generate_flashcards_from_gemini(topic):
    """Generate 15 detailed, university-level flashcards about the topic"""
    
    api_key = os.getenv('GEMINI_API_KEY')
    url = f"https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent?key={api_key}"
    
    prompt = f"""
    You are an expert university professor teaching {topic}.

    Create 15 detailed, high-quality flashcards about {topic}. 
    Each flashcard should be unique and cover different aspects, definitions, examples, applications, and advanced concepts.

    For each flashcard, format it exactly like this example:

    **Flashcard X**
    **Front:** [The question]
    **Back:** [Detailed answer with explanations, code examples if applicable, and key points]

    Make sure:
        - Questions are thought-provoking and test understanding, not just memorization
        - Answers are detailed, clear, and accurate (either in few words or maximum 1 sentence.)
        - Cover a wide range of topics within {topic}
        - Include practical examples where applicable

    Return your response as a JSON array in this exact format:

[
    {{
        "question": "What is Python and what are its key characteristics?",
        "answer": "Python is a high-level, interpreted programming language known for its readability and simplicity."
    }},
    {{
        "question": "What is the difference between a list and a tuple?",
        "answer": "List: Mutable (can be changed). Tuple: Immutable (cannot be changed)."
    }}
]

    Only return the JSON array, no other text.
"""
    
    data = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ]
    }

    # Send the request to Gemini
    print(f"Generating flashcards for: {topic}...")
    response = requests.post(url, json=data, timeout=30)
 
    # Check if the request was successful
    if response.status_code != 200:
        print(f"Error: Gemini API returned status {response.status_code}")
        print(f"Details: {response.text}")
        return None
 
    result = response.json()
 
    # Extract the text from the response
    text = result['candidates'][0]['content']['parts'][0]['text']
 
    # Remove markdown code fences if Gemini added them
    text = text.strip()
    if text.startswith('```json'):
        text = text[7:]
    if text.startswith('```'):
        text = text[3:]
    if text.endswith('```'):
        text = text[:-3]
    text = text.strip()
 
    # Parse the JSON
    flashcards_data = json.loads(text)
 
    # Remove duplicate questions
    seen_questions = []
    unique_flashcards = []
    for card in flashcards_data:
        question_lower = card['question'].lower()
        if question_lower not in seen_questions:
            seen_questions.append(question_lower)
            unique_flashcards.append(card)
 
    flashcards_data = unique_flashcards
 
    # Pad to 15 if we ended up with fewer cards
    for i in range(len(flashcards_data), 15):
        flashcards_data.append({
            "question": f"Advanced concept {i + 1} about {topic}?",
            "answer": f"This is an important advanced concept in {topic}."
        })
 
    return flashcards_data[:15]


def generate_quiz(topic):
    """Generate a 20-question multiple-choice quiz using Gemini"""
    
    api_key = os.getenv('GEMINI_API_KEY')
    url = f"https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent?key={api_key}"
    
    prompt = f"""
    Create a 20-question multiple-choice quiz about "{topic}".
    Each question should test understanding of key concepts.
    Every question must have EXACTLY 4 options, no more, no less. 
    Return ONLY a valid JSON array, no extra text or formatting

    For each question, provide:
    - question: The question text
    - options: Array of 4 options (A, B, C, D)
    - correct: The index of the correct answer (0, 1, 2, or 3)

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
    
    data = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ]
    }
    
    # Send the request to Gemini
    print(f"Generating quiz for: {topic}...")
    response = requests.post(url, json=data, timeout=30)
 
    # Check if the request was successful
    if response.status_code != 200:
        print(f"Error: Gemini API returned status {response.status_code}")
        print(f"Details: {response.text}")
        return None
 
    result = response.json()
 
    # Extract the text from the response
    text = result['candidates'][0]['content']['parts'][0]['text']
 
    # Remove markdown code fences if Gemini added them
    text = text.strip()
    if text.startswith('```json'):
        text = text[7:]
    if text.startswith('```'):
        text = text[3:]
    if text.endswith('```'):
        text = text[:-3]
    text = text.strip()
 
    # Parse the JSON
    quiz_data = json.loads(text)

    # Remove duplicate questions
    seen_questions = []
    unique_quiz = []
    for question in quiz_data:
        question_lower = question['question'].lower()
        
        if question_lower not in seen_questions:
            seen_questions.append(question_lower)
            unique_quiz.append(question)
            
    quiz_data = unique_quiz
    
    # Remove any questions that don't have exactly 4 options
    valid_quiz = []
    for question in quiz_data:
        if isinstance(question.get('options'), list) and len(question['options']) == 4:
            valid_quiz.append(question)

    print("VALID QUIZ COUNT:", len(quiz_data))
    for i, q in enumerate(quiz_data):
        print(f"Q{i+1} options: {q.get('options')}")

    quiz_data = valid_quiz

    # Pad to 20 if we ended up with fewer questions
    for i in range(len(quiz_data), 20):
        quiz_data.append({
            "question": f"Additional question {i + 1} about {topic}?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correct": 0
        })

    return quiz_data[:20]

def generate_summary(topic):
    """Generate a concise study summary for the given topic"""
    
    prompt = f"""
    Create a concise, easy-to-understand study summary about "{topic}".

    Requirements:
    - Use clear bullet points
    - Focus on key concepts
    - Keep it suitable for a university student
    - Include short explanations
    """

    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content(prompt)

        print("Gemini response:", response.text) 

        return response.text.strip()

    except Exception as e:
        print("Gemini ERROR:", str(e))  
        return None