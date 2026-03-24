from flask import Blueprint, render_template, jsonify, request, current_app

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
def generate_summary():
    data = request.get_json()

    if not data or 'topic' not in data:
        return jsonify({"error": "Topic is required"}), 400

    topic = data['topic']

    return jsonify({
        "message": "Summary endpoint created successfully",
        "topic": topic,
        "summary": "This is a placeholder summary. Gemini integration will be added in Week 12."
    }), 200


