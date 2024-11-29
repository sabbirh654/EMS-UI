import { AttendanceAddDto, AttendanceUpdateDto } from "./models/attendance.model"

export function AttendanceUpdateMapper(attendaceInfo: any): AttendanceUpdateDto {
    return {
        checkInTime: attendaceInfo.checkInTime,
        checkOutTime: attendaceInfo.checkOutTime
    }
}

export function AttendanceAddMapper(attendanceInfo: any): AttendanceAddDto {
    return {
        employeeId: attendanceInfo.employeeId,
        date: attendanceInfo.date,
        checkInTime: attendanceInfo.checkInTime,
        checkOutTime: attendanceInfo.checkOutTime
    }
}