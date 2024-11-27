import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/response.model';
import { EmployeeDetails } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:7168/api/Employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<ApiResponse<EmployeeDetails[]>> {
    return this.http.get<ApiResponse<EmployeeDetails[]>>(this.apiUrl);
  }

  deleteEmployee(id: number): Observable<ApiResponse<number>> {
    return this.http.delete<ApiResponse<number>>(`${this.apiUrl}/${id}`);
  }
}
