import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto, RegisterDto, Tokens } from '../models/auth.model';
import { ApiResponse } from '@shared/models/response.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7168/api/Auth';
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: LoginDto): Observable<ApiResponse<Tokens>> {
    return this.http.post<ApiResponse<Tokens>>(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: RegisterDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}/register`, credentials);
  }

  refresh(refreshToken: string): Observable<ApiResponse<Tokens>> {
    return this.http.post<ApiResponse<Tokens>>(`${this.apiUrl}/refresh`, refreshToken);
  }

  setSession(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.isLoggedInSubject.next(true);
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
        next: () => {
          // Clear local storage and update the state
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.isLoggedInSubject.next(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed', err);
        }
      });
    } else {
      // If no refresh token exists, just clear local storage and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
}
