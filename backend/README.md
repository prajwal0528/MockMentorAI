# MockMentorAI — Backend

A secure mock interview platform that detects cheating via computer vision and AI-generated questions.

## Tech Stack
- Python 3.9+
- Flask
- OpenCV + dlib (face landmark detection)
- DeepSeek-Coder & Llama3.2-Vision via Remote API
- RESTful APIs

## Setup

1. Clone repo
2. Install dependencies: `pip3 install -r requirements.txt`
3. Download dlib model: `cd data/models && wget http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2 && bzip2 -d shape_predictor_68_face_landmarks.dat.bz2`
4. Set environment variable (optional):  
   ```bash

## To run 
frontend: npm run dev
backend: source venv/bin/activate
         python app.py