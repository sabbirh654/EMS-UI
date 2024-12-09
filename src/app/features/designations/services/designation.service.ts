import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../shared/models/response.model';
import {
  AddUpdateDesignationDto,
  Designation,
} from '../models/designation.model';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private apiUrl = 'https://localhost:7168/api/Designations';

  constructor(private http: HttpClient) {}

  getDesignations(): Observable<ApiResponse<Designation[]>> {
    return this.http.get<ApiResponse<Designation[]>>(this.apiUrl);
  }

  deleteDesignation(id: number): Observable<ApiResponse<number>> {
    return this.http.delete<ApiResponse<number>>(`${this.apiUrl}/${id}`);
  }

  updateDesignation(
    id: number,
    dto: AddUpdateDesignationDto
  ): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.apiUrl}/${id}`, dto);
  }

  addDesignation(
    dto: AddUpdateDesignationDto
  ): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(this.apiUrl, dto);
  }
}
