from services.ai_service import AIService

class AnswerAnalyzer:
    def __init__(self):
        self.ai_service = AIService()

    def analyze(self, question, answer):
        return self.ai_service.analyze_answer(question, answer)