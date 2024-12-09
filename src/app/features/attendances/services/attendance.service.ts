import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../shared/models/response.model';
import {
  Attendance,
  AttendanceAddDto,
  AttendanceDetails,
  AttendanceFilter,
  AttendanceUpdateDto,
} from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = 'https://localhost:7168/api/Attendances';

  constructor(private http: HttpClient) {}

  getAttendance(
    filter: AttendanceFilter
  ): Observable<ApiResponse<Attendance[]>> {
    let params = new HttpParams();

    Object.keys(filter).forEach((key) => {
      const value = filter[key as keyof AttendanceFilter];
      if (value !== null && value !== undefined) {
        params = params.set(key, value as string);
      }
    });

    return this.http.get<ApiResponse<Attendance[]>>(this.apiUrl, { params });
  }

  getEmployeeAttendance(id: number) {
    return this.http.get<ApiResponse<AttendanceDetails[]>>(
      `${this.apiUrl}/${id}`
    );
  }

  deleteAttendance(id: number): Observable<ApiResponse<number>> {
    return this.http.delete<ApiResponse<number>>(`${this.apiUrl}/${id}`);
  }

  updateAttendance(
    id: number,
    dto: AttendanceUpdateDto
  ): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.apiUrl}/${id}`, dto);
  }

  addAttendance(dto: AttendanceAddDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(this.apiUrl, dto);
  }
}
