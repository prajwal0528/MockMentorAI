MockMentorAI

MockMentorAI is an AI-powered mock interview platform designed to simulate technical interviews and provide automated interview assistance and behavioral feedback.

The system combines AI-generated interview questions, computer vision, and code analysis to create a more interactive mock interview experience.

Features
AI-Generated Interview Questions
Generates technical interview questions based on the selected topic or technology.
Supports dynamic interview sessions.
Computer Vision Monitoring
Uses OpenCV and facial landmark detection to monitor candidate attention.
Detects changes in face orientation and visual attention during the interview.
AI-Based Code Analysis
Analyzes programming responses and code snippets.
Uses AI models to assist with technical evaluation.
Interview Feedback
Provides automated feedback based on interview performance.
Helps candidates identify areas that require improvement.
Secure Backend
Flask-based backend architecture.
Designed to separate interview processing, AI services, and computer vision components.
System Architecture
                     ┌──────────────────────┐
                     │      Frontend        │
                     │   Interview Client   │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │    Flask Backend     │
                     │       API Layer      │
                     └──────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │ AI Question  │  │  Computer    │  │ Code Analysis│
      │ Generation   │  │    Vision    │  │     Engine   │
      └──────────────┘  └──────────────┘  └──────────────┘
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
                     ┌──────────────────────┐
                     │ Interview Feedback   │
                     └──────────────────────┘
Tech Stack
Backend
Python
Flask
REST APIs
Artificial Intelligence
DeepSeek-Coder
AI-generated interview questions
AI-assisted code analysis
Computer Vision
OpenCV
dlib
Facial landmark detection
Development Tools
Git
GitHub
Python Virtual Environment
Project Structure
MockMentorAI/
│
├── app/
│   ├── routes/
│   ├── services/
│   └── ...
│
├── models/
│   └── ...
│
├── utils/
│   └── ...
│
├── static/
│   └── ...
│
├── templates/
│   └── ...
│
├── requirements.txt
├── .gitignore
├── README.md
└── app.py

The exact structure may vary depending on the current implementation.

Installation
1. Clone the Repository
git clone git@github.com-personal:prajwal0528/MockMentorAI.git

Or using HTTPS:

git clone https://github.com/prajwal0528/MockMentorAI.git

Navigate into the project:

cd MockMentorAI
2. Create a Virtual Environment

Linux/macOS:

python3 -m venv venv

Activate it:

source venv/bin/activate

Windows:

python -m venv venv
venv\Scripts\activate
3. Install Dependencies
pip install -r requirements.txt
Environment Variables

Create a .env file in the project root if your implementation requires API keys or other configuration values.

Example:

API_KEY=your_api_key_here
MODEL_NAME=your_model_name

Never commit .env files or API keys to GitHub.

Make sure .env is included in .gitignore:

.env
venv/
__pycache__/
*.pyc
Running the Application

Activate the virtual environment:

source venv/bin/activate

Start the Flask server:

python app.py

Depending on the Flask configuration, the application will normally be available at:

http://127.0.0.1:5000
Interview Workflow

A typical MockMentorAI session follows this process:

Start Interview
      │
      ▼
Select Technology / Topic
      │
      ▼
AI Generates Question
      │
      ▼
Candidate Provides Answer
      │
      ├───────────────┐
      ▼               ▼
Code Analysis    CV Monitoring
      │               │
      └───────┬───────┘
              ▼
       Interview Analysis
              │
              ▼
        Feedback Report
Computer Vision Monitoring

MockMentorAI uses computer vision to analyze visual attention during an interview.

The system can use:

Face detection
Facial landmarks
Head orientation
Eye/face positioning
Attention-related indicators

The purpose of this functionality is to provide interview feedback and self-improvement insights, rather than to make definitive judgments about a candidate.

AI Question Generation

The AI component can generate interview questions based on the selected technical domain.

For example:

Technology: Python
Difficulty: Intermediate

        ↓

AI Question Generation

        ↓

Question:
"Explain the difference between a list and tuple
in Python and describe a situation where you would
prefer one over the other."

Questions can be adapted to the selected technology and interview context.

Code Analysis

MockMentorAI can use AI-assisted analysis to examine programming responses.

The analysis can help identify:

Logical issues
Potential improvements
Code quality concerns
Possible optimization opportunities
Explanation of programming concepts

The system is intended as an educational and interview-practice tool.

Feedback

After an interview session, the platform can provide feedback related to areas such as:

Technical responses
Code quality
Interview interaction
Attention-related indicators
Areas for improvement

The feedback should be treated as supportive guidance, not as a replacement for professional human evaluation.

Security Considerations

When deploying the application:

Never expose API keys in source code.
Store secrets using environment variables.
Do not commit .env files.
Validate user input on the backend.
Restrict access to sensitive API endpoints.
Use HTTPS for production deployments.
Avoid storing unnecessary camera or interview data.
Development

Clone the repository:

git clone git@github.com-personal:prajwal0528/MockMentorAI.git
cd MockMentorAI

Create and activate the environment:

python3 -m venv venv
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Run the development server:

python app.py
Troubleshooting
Flask Command Not Found

Make sure the virtual environment is activated:

source venv/bin/activate

Then install Flask:

pip install flask
Dependency Errors

Upgrade pip:

python -m pip install --upgrade pip

Then reinstall dependencies:

pip install -r requirements.txt
dlib Installation Issues

dlib may require additional system dependencies depending on the operating system.

On Debian/Kali-based systems, additional development packages may be required before installing it.

Project Status

MockMentorAI is an actively developed project.

Current development focuses on improving:

AI interview generation
Computer vision monitoring
Code analysis
Interview feedback
Backend reliability
User experience
Future Enhancements

Personalized interview difficulty

Multiple interview modes

Resume-based question generation

Real-time interview scoring

Voice-based interview interaction

Speech analysis

Detailed performance dashboards

Interview history

Multiple programming languages

Improved computer vision analysis

LLM-based personalized feedback

Cloud deployment

Disclaimer

MockMentorAI is designed primarily for interview practice and educational purposes.

Computer vision and AI-generated feedback can have limitations and should not be interpreted as definitive assessments of a person's ability, behavior, or suitability for employment.

Author

Prajwal S

AI Developer | Software Developer

GitHub:
https://github.com/prajwal0528

License

This project is intended for educational and development purposes.

Add an appropriate open-source license if you plan to distribute the project publicly.
