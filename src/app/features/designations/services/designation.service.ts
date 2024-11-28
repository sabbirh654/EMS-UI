import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Designation } from '../models/designation.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private apiUrl = 'https://localhost:7168/api/Designations';

  constructor(private http: HttpClient) { }

  getDesignations(): Observable<ApiResponse<Designation[]>> {
    return this.http.get<ApiResponse<Designation[]>>(this.apiUrl);
  }
}
