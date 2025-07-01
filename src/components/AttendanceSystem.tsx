
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

  const handleStartSystem = () => {
    setIsActive(true);
    toast.success("Attendance system activated!", {
      description: "Camera is now scanning for faces"
    });
  };

  const handleStopSystem = () => {
    setIsActive(false);
    toast.info("Attendance system deactivated");
  };

  const handleFaceDetected = (faceCount: number) => {
    setDetectedFaces(faceCount);
  };

  const handleAttendanceMarked = (record: AttendanceRecord) => {
    setAttendanceRecords(prev => [...prev, record]);
    toast.success(`Attendance marked for ${record.name}`, {
      description: `Status: ${record.status.toUpperCase()} (${Math.round(record.confidence * 100)}% confidence)`
    });
  };

  const handleCaptureImage = () => {
    if (!isActive) {
      toast.error("Please activate the system first");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate face recognition processing
    setTimeout(() => {
      const mockRecords: AttendanceRecord[] = [
        {
          id: Date.now().toString(),
          name: "John Doe",
          timestamp: new Date(),
          status: 'present',
          confidence: 0.92
        },
        {
          id: (Date.now() + 1).toString(),
          name: "Jane Smith", 
          timestamp: new Date(),
          status: 'present',
          confidence: 0.88
        }
      ];

      mockRecords.forEach(record => handleAttendanceMarked(record));
      setIsProcessing(false);
    }, 2000);
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
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Advanced facial recognition system for automated attendance tracking with real-time processing
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">System Status</p>
                <p className="text-2xl font-bold">
                  {isActive ? "Active" : "Inactive"}
                </p>
              </div>
              {isActive ? (
                <CheckCircle className="h-8 w-8 text-green-300" />
              ) : (
                <XCircle className="h-8 w-8 text-red-300" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Faces Detected</p>
                <p className="text-2xl font-bold">{detectedFaces}</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Present</p>
                <p className="text-2xl font-bold">
                  {attendanceRecords.filter(r => r.status === 'present').length}
                </p>
              </div>
              <Badge className="bg-white text-purple-600 px-2 py-1">
                Today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Processing</p>
                <p className="text-2xl font-bold">
                  {isProcessing ? "Active" : "Idle"}
                </p>
              </div>
              <div className={`h-3 w-3 rounded-full ${isProcessing ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera Feed Section */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Live Camera Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <CameraFeed 
                isActive={isActive}
                onFaceDetected={handleFaceDetected}
              />
              <FaceDetection 
                isActive={isActive}
                faceCount={detectedFaces}
              />
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-4 mt-6">
              {!isActive ? (
                <Button 
                  onClick={handleStartSystem}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start System
                </Button>
              ) : (
                <Button 
                  onClick={handleStopSystem}
                  variant="destructive"
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-semibold py-3"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Stop System
                </Button>
              )}
              
              <Button 
                onClick={handleCaptureImage}
                disabled={!isActive || isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AttendanceList records={attendanceRecords} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
