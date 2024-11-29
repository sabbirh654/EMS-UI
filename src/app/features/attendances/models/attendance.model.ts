export interface Attendance {
    id: number;
    employeeId: number;
    date: Date;
    checkInTime: Date;
    checkOutTime: Date;
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
    employeeId?: number | null,
    date?: string | null
}