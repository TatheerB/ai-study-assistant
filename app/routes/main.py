from flask import Blueprint, render_template, jsonify, request, current_app
from app.services.gemini_service import generate_flashcards_from_gemini, generate_quiz
from datetime import datetime
from app.services.gemini_service import generate_summary

import os
print(f"API Key loaded: {os.getenv('GEMINI_API_KEY') is not None}")

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/flashcards')
def flashcards():
    return render_template('flashcards.html')

@main_bp.route('/quiz')
def quiz():
    return render_template('quiz.html')

@main_bp.route('/health')
def health():
    return jsonify({'status': 'healthy'}), 200

@main_bp.route('/generate-summary', methods=['POST'])
def summary():
    data = request.get_json()

    if not data or 'topic' not in data:
        return jsonify({'error': 'Topic is required'}), 400

    topic = data['topic'].strip()

    if not topic:
        return jsonify({'error': 'Topic cannot be empty'}), 400

    summary_text = generate_summary(topic)

    if not summary_text:
        return jsonify({'error': 'Failed to generate summary'}), 500

    return jsonify({
        'topic': topic,
        'summary': summary_text
    }), 200

@main_bp.route('/save-study-set', methods=['POST'])
def save_study_set():
    data = request.get_json()

    # Validate input
    if not data or 'topic' not in data or 'summary' not in data:
        return jsonify({'error': 'Topic and summary are required'}), 400

    topic = data['topic'].strip()
    summary = data['summary'].strip()

    if not topic or not summary:
        return jsonify({'error': 'Topic and summary cannot be empty'}), 400

    try:
        # Create document
        study_set = {
            'topic': topic,
            'summary': summary,
            'created_at': datetime.utcnow()
        }

        # Insert into MongoDB
        result = current_app.db.study_sets.insert_one(study_set)

        return jsonify({
            'message': 'Study set saved successfully',
            'id': str(result.inserted_id)
        }), 201

    except Exception as e:
        print("DB ERROR:", str(e))
        return jsonify({'error': 'Failed to save study set'}), 500

@main_bp.route('/get-history', methods=['GET'])
def get_history():
    return jsonify({
        "message": "History endpoint created successfully",
        "history": []
    }), 200

@main_bp.route('/delete-study-set', methods=['DELETE'])
def delete_study_set():
    data = request.get_json()

    if not data or 'topic' not in data:
        return jsonify({"error": "Topic is required to delete a study set"}), 400

    return jsonify({
        "message": "Delete endpoint created successfully",
        "deleted_topic": data['topic']
    }), 200

@main_bp.route('/generate-flashcards', methods=['POST'])
def generate_flashcards():
    data = request.get_json()
    topic = data.get('topic')
    
    if not topic:
        return jsonify({'error': 'Topic is required'}), 400
    
    try:
        flashcards = generate_flashcards_from_gemini(topic)
        return jsonify({'flashcards': flashcards})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
@main_bp.route('/generate-quiz', methods=['POST'])
def generate_quiz_endpoint():
    data = request.get_json()
    topic = data.get('topic')
    
    if not topic:
        return jsonify({'error': 'Topic is required'}), 400
    
    try:
        quiz_data = generate_quiz(topic)
        return jsonify({'quiz': quiz_data})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

