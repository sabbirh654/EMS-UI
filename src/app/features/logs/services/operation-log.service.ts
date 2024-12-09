import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../shared/models/response.model';
import { LogFilter, OperationLog } from '../models/log.model';

@Injectable({
  providedIn: 'root',
})
export class OperationLogService {
  private apiUrl = 'https://localhost:7168/api/OperationLogs';

  constructor(private http: HttpClient) {}

  getLogs(filter: LogFilter): Observable<ApiResponse<OperationLog[]>> {
    let params = new HttpParams();

    Object.keys(filter).forEach((key) => {
      const value = filter[key as keyof LogFilter];
      if (value !== null && value !== undefined) {
        params = params.set(key, value as string);
      }
    });

    return this.http.get<ApiResponse<OperationLog[]>>(this.apiUrl, { params });
  }
}
