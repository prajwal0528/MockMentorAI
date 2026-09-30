import React from 'react';
import { AlertTriangle, Shield, Eye, Camera, CheckCircle } from 'lucide-react';

interface CheatingAlertProps {
  warningCount: number;
  isCheating: boolean;
  eyesClosed: boolean;
  lookingAway: boolean;
  cameraBlocked: boolean;
}

const CheatingAlert: React.FC<CheatingAlertProps> = ({ 
  warningCount, 
  isCheating, 
  eyesClosed, 
  lookingAway, 
  cameraBlocked 
}) => {
  if (isCheating) {
    return (
      <div className="backdrop-blur-xl bg-red-500/20 p-6 rounded-3xl border-2 border-red-400/50 shadow-2xl animate-pulse">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/30 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-red-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-300 mb-2">🚨 CHEATING FLAGGED!</h3>
            <p className="text-red-200">
              Suspicious behavior detected. Please maintain proper interview conduct.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cameraBlocked) {
    return (
      <div className="backdrop-blur-xl bg-red-500/20 p-6 rounded-3xl border-2 border-red-400/50 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/30 rounded-2xl">
            <Camera className="w-6 h-6 text-red-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-300 mb-2">📷 CAMERA BLOCKED</h3>
            <p className="text-red-200">
              Your camera appears to be blocked or covered. Please ensure clear visibility.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (eyesClosed) {
    return (
      <div className="backdrop-blur-xl bg-yellow-500/20 p-6 rounded-3xl border-2 border-yellow-400/50 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-500/30 rounded-2xl">
            <Eye className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-300 mb-2">😴 EYES CLOSED DETECTED</h3>
            <p className="text-yellow-200">
              Please keep your eyes open and maintain eye contact with the camera.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (lookingAway) {
    return (
      <div className="backdrop-blur-xl bg-yellow-500/20 p-6 rounded-3xl border-2 border-yellow-400/50 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-500/30 rounded-2xl">
            <Eye className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-300 mb-2">👀 LOOKING AWAY DETECTED</h3>
            <p className="text-yellow-200">
              Please maintain eye contact with the camera during the interview.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (warningCount > 0) {
    return (
      <div className="backdrop-blur-xl bg-yellow-500/20 p-6 rounded-3xl border-2 border-yellow-400/50 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-500/30 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-300 mb-2">⚠️ Warnings: {warningCount}</h3>
            <p className="text-yellow-200">
              Please maintain proper posture and eye contact with the camera.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-green-500/20 p-6 rounded-3xl border-2 border-green-400/50 shadow-2xl">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-500/30 rounded-2xl">
          <CheckCircle className="w-6 h-6 text-green-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-green-300 mb-2">✅ All Clear - Excellent Behavior</h3>
          <p className="text-green-200">
            Good eye contact and proper interview conduct maintained.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheatingAlert;