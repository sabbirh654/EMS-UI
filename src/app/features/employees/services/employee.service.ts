import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../shared/models/response.model';
import {
  EmployeeAddDto,
  EmployeeDetails,
  EmployeeUpdateDto,
} from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7168/api/Employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<ApiResponse<EmployeeDetails[]>> {
    return this.http.get<ApiResponse<EmployeeDetails[]>>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<ApiResponse<EmployeeDetails>> {
    var data = this.http.get<ApiResponse<EmployeeDetails>>(
      `${this.apiUrl}/${id}`
    );
    return data;
  }

  deleteEmployee(id: number): Observable<ApiResponse<number>> {
    return this.http.delete<ApiResponse<number>>(`${this.apiUrl}/${id}`);
  }

  updateEmployee(
    id: number,
    employeeUpdateDto: EmployeeUpdateDto
  ): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(
      `${this.apiUrl}/${id}`,
      employeeUpdateDto
    );
  }

  addEmployee(employeeAddDto: EmployeeAddDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(this.apiUrl, employeeAddDto);
  }

  downloadEmployeeListXlsx(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-xlsx`, {
      responseType: 'blob',
    });
  }

  downloadEmployeeListCsv(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-csv`, {
      responseType: 'blob',
    });
  }
}
