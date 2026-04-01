import os
import json
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


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
- Answers are detailed, clear, and accurate (3-5 sentences minimum)
- Cover a wide range of topics within {topic}
- Include practical examples where applicable

Return your response as a JSON array in this exact format:

[
    {{
        "question": "What is Python and what are its key characteristics?",
        "answer": "Python is a high-level, interpreted programming language known for its readability and simplicity.\\n\\nInterpreted: Executes code line by line.\\nDynamically typed: Variable types are determined at runtime.\\nObject-oriented: Supports classes and objects.\\nExtensive standard library: 'Batteries included' philosophy."
    }},
    {{
        "question": "What is the difference between a list and a tuple?",
        "answer": "List: Mutable (can be changed), defined with square brackets [ ]. Slower but more flexible.\\n\\nTuple: Immutable (cannot be changed), defined with parentheses ( ). Faster and can be used as dictionary keys."
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
    
    response = requests.post(url, json=data)
    result = response.json()
    
    try:
        # Extract the text from Gemini's response
        text = result['candidates'][0]['content']['parts'][0]['text']
        
        # Clean up the text - remove markdown code blocks if present
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
        
        if len(flashcards_data) < 15:
            for i in range(len(flashcards_data), 15):
                flashcards_data.append({
                    "question": f"Advanced concept {i+1} about {topic}?",
                    "answer": f"This is an important advanced concept in {topic}."
                })
        
        return flashcards_data[:15]
        
    except Exception as e:
        print(f"Error parsing flashcards: {e}")
        fallback = [
            {"question": f"What is {topic} and what are its key characteristics?", "answer": f"{topic} is a fascinating subject with many applications. Key characteristics include its core principles, practical applications, and theoretical foundations."},
            {"question": f"What are the main applications of {topic}?", "answer": f"{topic} has applications in various fields including education, research, and industry."},
            {"question": f"What are the key concepts in {topic}?", "answer": f"The key concepts include fundamental principles, advanced theories, and practical implementations."},
            {"question": f"Why is {topic} important?", "answer": f"{topic} is important because it helps us understand complex systems and solve real-world problems."},
            {"question": f"What are common challenges when learning {topic}?", "answer": f"Common challenges include understanding core concepts, applying theory to practice, and staying updated with latest developments."}
        ]
        # Add more to reach 15
        while len(fallback) < 15:
            fallback.append({
                "question": f"Additional concept about {topic}?",
                "answer": f"This is another important aspect of {topic}."
            })
        return fallback[:15]

def generate_quiz(topic):
    """Generate a 20-question multiple-choice quiz using Gemini"""
    
    api_key = os.getenv('GEMINI_API_KEY')
    url = f"https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent?key={api_key}"
    
    prompt = f"""
    Create a 20-question multiple-choice quiz about "{topic}".
    Each question should test understanding of key concepts.

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
    
    response = requests.post(url, json=data)
    result = response.json()
    
    try:
        text = result['candidates'][0]['content']['parts'][0]['text']

        # Clean up the text
        text = text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()
        quiz_data = json.loads(text)
        
        if len(quiz_data) < 20:
            while len(quiz_data) < 20:
                quiz_data.append({
                    "question": f"Additional question about {topic}?",
                    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                    "correct": 0
                })
        return quiz_data[:20]
    
    except Exception as e:
        print(f"Error parsing quiz: {e}")
        fallback = []
        for i in range(20):
            fallback.append({
                "question": f"Question {i+1}: What is {topic}?",
                "options": ["Definition 1", "Definition 2", "Definition 3", "Definition 4"],
                "correct": 0
            })
        return fallback
    

def generate_summary(topic):
    """Generate a concise study summary using the instructor-supported endpoint."""

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("Gemini ERROR: API key not found")
        return None

    url = f"https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent?key={api_key}"

    prompt = f"""
    Create a concise, easy-to-understand study summary about "{topic}".

    Requirements:
    - Use clear bullet points
    - Focus on key concepts
    - Keep it suitable for a university student
    - Include short explanations
    - Keep it informative but not too long
    """

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()

        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return text.strip()

    except Exception as e:
        print("Gemini ERROR:", str(e))
        return None