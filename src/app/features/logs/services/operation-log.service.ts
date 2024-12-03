import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogFilter, OperationLog } from '../models/log.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class OperationLogService {

  private apiUrl = 'https://localhost:7168/api/OperationLogs';

  constructor(private http: HttpClient) { }

  getLogs(filter: LogFilter): Observable<ApiResponse<OperationLog[]>> {
    let params = new HttpParams();

    // Append only non-null and non-undefined values to params
    Object.keys(filter).forEach(key => {
      const value = filter[key as keyof LogFilter];
      if (value !== null && value !== undefined) {
        params = params.set(key, value as string); // Set parameter if value is valid
      }
    });

    return this.http.get<ApiResponse<OperationLog[]>>(this.apiUrl, { params });
  }
}
