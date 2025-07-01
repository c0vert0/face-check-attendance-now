import { useState, useRef, useEffect } from "react";
import { Camera, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CameraFeed } from "./CameraFeed";
import { AttendanceList } from "./AttendanceList";
import { FaceDetection } from "./FaceDetection";

export interface AttendanceRecord {
  id: string;
  name: string;
  timestamp: Date;
  status: 'present' | 'absent';
  confidence: number;
}

export const AttendanceSystem = () => {
  const [isActive, setIsActive] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [detectedFaces, setDetectedFaces] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState<string | null>(null);
  const [userConfidence, setUserConfidence] = useState<number>(0);

  const handleStartSystem = () => {
    setIsActive(true);
    toast.success("Attendance system activated!", {
      description: "Camera is now scanning for faces"
    });
  };

  const handleStopSystem = () => {
    setIsActive(false);
    setRecognizedUser(null);
    toast.info("Attendance system deactivated");
  };

  const handleFaceDetected = (faceCount: number) => {
    setDetectedFaces(faceCount);
    
    // Simulate face recognition when faces are detected
    if (faceCount > 0 && isActive) {
      const mockUsers = ["Asrar", "Mahesh", "unknown"];
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-99
      
      setRecognizedUser(randomUser);
      setUserConfidence(confidence);
    } else {
      setRecognizedUser(null);
      setUserConfidence(0);
    }
  };

  const handleAttendanceMarked = (record: AttendanceRecord) => {
    setAttendanceRecords(prev => [...prev, record]);
    toast.success(`Attendance marked for ${record.name}`, {
      description: `Status: ${record.status.toUpperCase()}`
    });
  };

  const handleCaptureImage = () => {
    if (!isActive) {
      toast.error("Please activate the system first");
      return;
    }
    
    if (detectedFaces === 0) {
      toast.error("No faces detected to capture");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate face recognition processing
    setTimeout(() => {
      if (recognizedUser) {
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          name: recognizedUser,
          timestamp: new Date(),
          status: 'present',
          confidence: userConfidence / 100
        };
        
        handleAttendanceMarked(newRecord);
      }
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Camera className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">
            Multi-Face Attendance Management System
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Camera and Controls */}
        <div className="space-y-6">
          {/* Live Camera Feed */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                📹 Live Camera Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CameraFeed 
                isActive={isActive}
                onFaceDetected={handleFaceDetected}
              />
            </CardContent>
          </Card>

          {/* Capture Image Button */}
          <Button 
            onClick={handleCaptureImage}
            disabled={!isActive || isProcessing || detectedFaces === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              "Capture Image"
            )}
          </Button>

          {/* System Controls */}
          <div className="flex gap-4">
            {!isActive ? (
              <Button 
                onClick={handleStartSystem}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                Start System
              </Button>
            ) : (
              <Button 
                onClick={handleStopSystem}
                variant="destructive"
                className="flex-1 font-semibold py-3"
              >
                Stop System
              </Button>
            )}
          </div>
        </div>

        {/* Right Side - Recognition Status and Records */}
        <div className="space-y-6">
          {/* Face Recognition Status */}
          {isActive && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {detectedFaces > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">✅ Faces Recognized!</span>
                    </div>
                  )}
                  
                  {recognizedUser && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-blue-900">
                        User Name: {recognizedUser}, Confidence: {userConfidence}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <p>Detected Faces: {detectedFaces}</p>
                    <p>Status: {isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attendance Records */}
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <AttendanceList records={attendanceRecords} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
