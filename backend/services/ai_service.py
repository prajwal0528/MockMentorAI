import os
import requests
from config import Config
from utils.logger import interview_logger

class AIService:
    def __init__(self):
        self.api_key = Config.LLM_API_KEY
        self.api_url = Config.LLM_API_URL

    def generate_question(self, job_role="Software Engineer", level="Junior"):
        """
        Generate an interview question using LLM
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        prompt = f"""
        You are an expert interviewer for {job_role} position at a top tech company.
        Generate one technical interview question suitable for a {level} candidate.
        Keep it concise, realistic, and focused on core skills.
        Do not include answers or hints.
        """

        payload = {
            "model": "llama3.2-vision:latest",
            "messages": [
                {"role": "system", "content": "You are a professional interviewer."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 100
        }

        try:
            response = requests.post(self.api_url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            result = response.json()

            # Extract answer from response
            question = result['choices'][0]['message']['content'].strip()
            interview_logger.info(f"Generated question: {question}")
            return question

        except Exception as e:
            interview_logger.error(f"LLM API Error: {str(e)}")
            return "Could not generate question due to system error."

    def analyze_answer(self, question, candidate_response, job_role="Software Engineer"):
        """
        Optional: Analyze answer quality (future enhancement)
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        prompt = f"""
        You are evaluating a candidate's answer for a {job_role} interview.
        Question: "{question}"
        Candidate Answer: "{candidate_response}"

        Rate the answer on a scale of 1-10 based on:
        - Relevance
        - Technical accuracy
        - Clarity
        - Completeness

        Return ONLY a JSON object: {{"score": int, "feedback": string}}
        """

        payload = {
            "model": "llama3.2-vision:latest",  # Use vision model even for text? It works fine.
            "messages": [
                {"role": "system", "content": "You are an expert interview evaluator."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "max_tokens": 100
        }

        try:
            response = requests.post(self.api_url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            result = response.json()
            analysis = result['choices'][0]['message']['content'].strip()

            # Parse JSON if possible
            import json
            parsed = json.loads(analysis)
            return parsed
        except Exception as e:
            interview_logger.error(f"Answer Analysis Error: {str(e)}")
            return {"score": 0, "feedback": "Analysis failed due to system error."}