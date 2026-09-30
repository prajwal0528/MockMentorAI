from utils.validators import validate_json
from flask import Blueprint, jsonify, request
from ai.question_generator import QuestionGenerator
from services.warning_service import WarningService
from config import Config  # 👈 ADD THIS LINE!

interview_bp = Blueprint('interview', __name__)
question_generator = QuestionGenerator()
warning_service = WarningService()

@interview_bp.route('/start', methods=['POST'])
@validate_json
def start_interview():
    data = request.get_json()
    job_role = data.get('job_role', 'Software Engineer')
    level = data.get('level', 'Junior')

    question = question_generator.get_next_question(job_role, level)
    warning_service.reset_warnings()

    return jsonify({
        "status": "started",
        "question": question,
        "question_number": 1,
        "total_questions": Config.QUESTIONS_PER_INTERVIEW  # ✅ Now this works!
    })

@interview_bp.route('/next-question', methods=['POST'])
@validate_json
def next_question():
    data = request.get_json()
    current_question_num = data.get('current_question', 0)

    if current_question_num >= Config.QUESTIONS_PER_INTERVIEW:  # ✅ Now this works!
        return jsonify({
            "status": "completed",
            "message": "Interview completed!"
        })

    question = question_generator.get_next_question()
    return jsonify({
        "question": question,
        "question_number": current_question_num + 1,
        "total_questions": Config.QUESTIONS_PER_INTERVIEW  # ✅ And this too!
    })