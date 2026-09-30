from services.ai_service import AIService

class QuestionGenerator:
    def __init__(self):
        self.ai_service = AIService()

    def get_next_question(self, job_role="Software Engineer", level="Junior"):
        return self.ai_service.generate_question(job_role, level)