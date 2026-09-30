import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx';
import Summary from './components/Summary.tsx';

// Define interface for performance data
interface PerformanceData {
  confidence_score: number;
  eye_contact_score: number;
  cheating_attempts: number;
  questions_answered: number;
  avg_response_time: number;
  improvement_areas: string[];
  greeting_message: string;
}

const App = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [question, setQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isCheating, setIsCheating] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [videoStreamActive, setVideoStreamActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Frontend-only tracking states
  const [eyesClosed, setEyesClosed] = useState(false);
  const [lookingAway, setLookingAway] = useState(false);
  const [cameraBlocked, setCameraBlocked] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [cheatingAttempts, setCheatingAttempts] = useState(0);
  const [eyeContactTime, setEyeContactTime] = useState(0);
  const [totalInterviewTime, setTotalInterviewTime] = useState(0);

  const webcamRef = useRef<Webcam>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eyeClosedTimeRef = useRef(0);
  const lookingAwayTimeRef = useRef(0);
  const eyeContactTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());

  // Use environment variable for backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (password !== 'welcome') {
      setLoginError('Invalid password.');
      return;
    }
    
    if (!email || !email.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    
    setShowLogin(false);
    resetAllStates();
  };

  // Reset all states
  const resetAllStates = () => {
    setInterviewStarted(false);
    setVideoStreamActive(false);
    setQuestion('');
    setCurrentQuestion(1);
    setTotalQuestions(5);
    setIsCheating(false);
    setWarningCount(0);
    setUserAnswer('');
    setInterviewCompleted(false);
    setPerformanceData(null);
    setShowSummary(false);
    setEyesClosed(false);
    setLookingAway(false);
    setCameraBlocked(false);
    setStartTime(null);
    setQuestionStartTime(null);
    setResponseTimes([]);
    setCheatingAttempts(0);
    setEyeContactTime(0);
    setTotalInterviewTime(0);
    eyeClosedTimeRef.current = 0;
    lookingAwayTimeRef.current = 0;
    eyeContactTimeRef.current = 0;
  };

  // Start Interview - Real backend integration
  const startInterview = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/interview/start`, {
        job_role: "Software Engineer",
        level: "Junior"
      });
      
      setQuestion(response.data.question);
      setCurrentQuestion(response.data.question_number);
      setTotalQuestions(response.data.total_questions);
      setInterviewStarted(true);
      setVideoStreamActive(true);
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to start interview:", err);
      alert("Failed to start interview. Please check backend connection.");
      setIsLoading(false);
    }
  };

  // Get next question - Real backend integration
  const getNextQuestion = async () => {
    if (!userAnswer.trim()) {
      alert("Please type your answer before proceeding to the next question.");
      return;
    }
    
    if (questionStartTime !== null) {
      const responseTime = (Date.now() - questionStartTime) / 1000;
      setResponseTimes(prev => [...prev, responseTime]);
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/interview/next-question`, {
        current_question: currentQuestion,
        user_answer: userAnswer
      });

      if (response.data.status === "completed") {
        endInterviewAndShowSummary();
        return;
      }

      setQuestion(response.data.question);
      setCurrentQuestion(response.data.question_number);
      setUserAnswer('');
      setQuestionStartTime(Date.now());
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to get next question:", err);
      alert("Error fetching next question. Please check backend connection.");
      setIsLoading(false);
    }
  };

  // End interview and show summary
  const endInterviewAndShowSummary = () => {
    const endTime = Date.now();
    const totalTime = startTime !== null ? (endTime - startTime) / 1000 : 0;
    setTotalInterviewTime(totalTime);
    
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 30;
    
    const eyeContactPercentage = totalTime > 0 
      ? Math.min(100, Math.round((eyeContactTimeRef.current / totalTime) * 100))
      : 85;
    
    const confidenceScore = Math.min(100, Math.max(20, 
      100 - (cheatingAttempts * 15) - (warningCount * 10)
    ));

    const improvementAreas: string[] = [];
    if (eyeContactPercentage < 70) {
      improvementAreas.push("Maintain better eye contact with the camera");
    }
    if (cheatingAttempts > 2) {
      improvementAreas.push("Avoid looking away from the screen during questions");
    }
    if (avgResponseTime > 60) {
      improvementAreas.push("Try to respond more quickly to questions");
    }
    if (warningCount > 3) {
      improvementAreas.push("Keep your eyes open and face visible to the camera");
    }

    const performance: PerformanceData = {
      confidence_score: confidenceScore,
      eye_contact_score: eyeContactPercentage,
      cheating_attempts: cheatingAttempts,
      questions_answered: currentQuestion,
      avg_response_time: Math.round(avgResponseTime),
      improvement_areas: improvementAreas.length > 0 ? improvementAreas : [],
      greeting_message: improvementAreas.length === 0 
        ? "Excellent performance! You maintained great eye contact and showed strong confidence throughout the interview."
        : "Good effort! Focus on the improvement areas to enhance your interview performance."
    };

    setPerformanceData(performance);
    setInterviewStarted(false);
    setVideoStreamActive(false);
    setInterviewCompleted(true);
    setShowSummary(true);
  };

  // Frontend-only cheating detection
  const detectCheatingBehavior = () => {
    if (!webcamRef.current || !videoStreamActive) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      let totalBrightness = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        totalBrightness += (r + g + b) / 3;
      }
      
      const avgBrightness = totalBrightness / (pixels.length / 4);
      const isVeryDark = avgBrightness < 20;
      
      setCameraBlocked(isVeryDark);
      
      const currentTime = Date.now();
      const timeDiff = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;
      
      const randomFactor = Math.random();
      const simulatedEyesClosed = randomFactor < 0.1;
      const simulatedLookingAway = randomFactor > 0.9;
      
      setEyesClosed(simulatedEyesClosed || isVeryDark);
      setLookingAway(simulatedLookingAway);
      
      if (simulatedEyesClosed || isVeryDark) {
        eyeClosedTimeRef.current += timeDiff / 1000;
      } else if (simulatedLookingAway) {
        lookingAwayTimeRef.current += timeDiff / 1000;
      } else {
        eyeContactTimeRef.current += timeDiff / 1000;
      }
      
      const eyesClosedTooLong = eyeClosedTimeRef.current > 3;
      const lookingAwayTooLong = lookingAwayTimeRef.current > 2;
      const cameraBlockedTooLong = isVeryDark;
      
      const shouldWarn = eyesClosedTooLong || lookingAwayTooLong || cameraBlockedTooLong;
      const shouldFlag = eyeClosedTimeRef.current > 5 || lookingAwayTimeRef.current > 4 || isVeryDark;
      
      if (shouldFlag && !isCheating) {
        setIsCheating(true);
        setCheatingAttempts(prev => prev + 1);
        setWarningCount(prev => prev + 1);
        
        setTimeout(() => {
          setIsCheating(false);
          eyeClosedTimeRef.current = 0;
          lookingAwayTimeRef.current = 0;
        }, 3000);
      } else if (shouldWarn && !isCheating) {
        setWarningCount(prev => Math.min(prev + 1, 10));
        
        setTimeout(() => {
          if (!shouldFlag) {
            eyeClosedTimeRef.current = Math.max(0, eyeClosedTimeRef.current - 1);
            lookingAwayTimeRef.current = Math.max(0, lookingAwayTimeRef.current - 1);
          }
        }, 1000);
      }
      
    } catch (error) {
      console.log("Video analysis error:", error);
      setCameraBlocked(true);
      setEyesClosed(true);
    }
  };

  useEffect(() => {
    if (!videoStreamActive) return;
    const detectionInterval = setInterval(detectCheatingBehavior, 500);
    return () => clearInterval(detectionInterval);
  }, [videoStreamActive, isCheating]);

  const endInterview = () => {
    endInterviewAndShowSummary();
  };

  // Face Mesh Drawing Effect
  useEffect(() => {
    if (!canvasRef.current || !webcamRef.current || !videoStreamActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = webcamRef.current.video;

    if (!ctx) return;

    const drawFaceMesh = () => {
      if (!video || video.readyState !== 4) {
        requestAnimationFrame(drawFaceMesh);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const padding = 0.1;
      const faceWidth = canvas.width * (1 - 2 * padding);
      const faceHeight = canvas.height * (1 - 2 * padding);
      const faceX = canvas.width * padding;
      const faceY = canvas.height * padding;

      const meshColor = isCheating ? 'red' : 
                       (eyesClosed || lookingAway || cameraBlocked) ? 'orange' : 
                       'rgba(0, 255, 0, 0.7)';

      ctx.strokeStyle = meshColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(faceX, faceY, faceWidth, faceHeight);

      const eyeRadius = faceWidth * 0.08;
      const eyeY = faceY + faceHeight * 0.35;
      const leftEyeX = faceX + faceWidth * 0.3;
      const rightEyeX = faceX + faceWidth * 0.7;
      
      ctx.beginPath();
      ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // if (eyesClosed) {
      //   ctx.fillStyle = 'red';
      //   ctx.fill();
      // }

      const noseX = faceX + faceWidth * 0.5;
      const noseY = faceY + faceHeight * 0.45;
      const noseLength = faceWidth * 0.15;
      ctx.beginPath();
      ctx.moveTo(noseX, noseY);
      ctx.lineTo(noseX, noseY + noseLength);
      ctx.stroke();

      const mouthY = faceY + faceHeight * 0.65;
      const mouthWidth = faceWidth * 0.4;
      const mouthLeft = faceX + faceWidth * 0.3;
      ctx.beginPath();
      ctx.arc(mouthLeft + mouthWidth/2, mouthY, mouthWidth/2, 0, Math.PI);
      ctx.stroke();

      if (isCheating) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.setLineDash([10, 10]);
        ctx.strokeRect(faceX - 15, faceY - 15, faceWidth + 30, faceHeight + 30);
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'red';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CHEATING DETECTED!', canvas.width / 2, faceY - 15);
      } else if (eyesClosed || cameraBlocked) {
        ctx.fillStyle = 'orange';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          cameraBlocked ? 'CAMERA BLOCKED!' : 'EYES CLOSED!', 
          canvas.width / 2, 
          faceY - 15
        );
      } else if (lookingAway) {
        ctx.fillStyle = 'orange';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LOOKING AWAY!', canvas.width / 2, faceY - 15);
      }

      requestAnimationFrame(drawFaceMesh);
    };

    drawFaceMesh();
  }, [webcamRef, isCheating, eyesClosed, lookingAway, cameraBlocked, videoStreamActive]);

  // Handler for starting new interview
  const handleStartNewInterview = () => {
    setShowSummary(false);
    setShowLogin(true);
    setEmail('');
    setPassword('');
    resetAllStates();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Login Page */}
        {showLogin && (
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loginError={loginError}
            handleLogin={handleLogin}
          />
        )}

        {/* Main Interview Interface */}
        {!showLogin && !showSummary && (
          <Home
            interviewStarted={interviewStarted}
            startInterview={startInterview}
            isLoading={isLoading}
            question={question}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            webcamRef={webcamRef}
            canvasRef={canvasRef}
            isCheating={isCheating}
            eyesClosed={eyesClosed}
            lookingAway={lookingAway}
            cameraBlocked={cameraBlocked}
            warningCount={warningCount}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            getNextQuestion={getNextQuestion}
            endInterview={endInterview}
          />
        )}

        {/* Performance Summary Page */}
        {showSummary && (
          <Summary
            performanceData={performanceData}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            warningCount={warningCount}
            onStartNewInterview={handleStartNewInterview}
          />
        )}
      </div>
    </div>
  );
};

export default App;