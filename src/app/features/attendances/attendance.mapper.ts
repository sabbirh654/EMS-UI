import { AttendanceAddDto, AttendanceUpdateDto } from "./models/attendance.model"

export function AttendanceUpdateMapper(attendaceInfo: any): AttendanceUpdateDto {
    return {
        checkInTime: attendaceInfo.checkIn.toLocaleTimeString(undefined, { hour12: false }),
        checkOutTime: attendaceInfo.checkOut.toLocaleTimeString(undefined, { hour12: false })
    }
}

export function AttendanceAddMapper(attendanceInfo: any): AttendanceAddDto {
    return {
        employeeId: attendanceInfo.employeeId,
        date: attendanceInfo.date,
        checkInTime: new Date(attendanceInfo.checkIn).toLocaleTimeString(undefined, { hour12: false }),
        checkOutTime: new Date(attendanceInfo.checkOut).toLocaleTimeString(undefined, { hour12: false })
    }
}