
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, User } from "lucide-react";
import { AttendanceRecord } from "./AttendanceSystem";

interface AttendanceListProps {
  records: AttendanceRecord[];
}

export const AttendanceList = ({ records }: AttendanceListProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (records.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="font-medium">No attendance records yet</p>
        <p className="text-sm">Start the system and capture faces to mark attendance</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="p-4 space-y-3">
        {records.map((record) => (
          <div 
            key={record.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {record.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{record.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-3 w-3" />
                    {formatTime(record.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Badge 
                  variant={record.status === 'present' ? 'default' : 'destructive'}
                  className="mb-1"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {record.status.toUpperCase()}
                </Badge>
                <p className="text-xs text-gray-500">
                  {Math.round(record.confidence * 100)}% confidence
                </p>
              </div>
            </div>
            
            {/* Confidence bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Recognition Confidence</span>
                <span>{Math.round(record.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${record.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
