export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface AttendanceDetails {
  attendanceDate: string;
  earliestCheckIn: string;
  latestCheckOut: string;
}

export interface AttendanceAddDto {
  employeeId: number;
  date: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface AttendanceUpdateDto {
  checkInTime: string;
  checkOutTime: string;
}

export interface AttendanceFilter {
  employeeId?: number | null;
  date?: string | null;
}
