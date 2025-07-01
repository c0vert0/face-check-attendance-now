
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { AttendanceRecord } from "./AttendanceSystem";

interface AttendanceListProps {
  records: AttendanceRecord[];
}

export const AttendanceList = ({ records }: AttendanceListProps) => {
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
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
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        📋 Attendance Records
      </h3>
      <ScrollArea className="h-80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">id</TableHead>
              <TableHead>name</TableHead>
              <TableHead>date</TableHead>
              <TableHead>time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{index}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{formatDate(record.timestamp)}</TableCell>
                <TableCell>{formatTime(record.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
