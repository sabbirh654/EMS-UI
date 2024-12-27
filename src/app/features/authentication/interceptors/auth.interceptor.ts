import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Route, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const accessToken = this.authService.getAccessToken();

        // Add the Authorization header if access token exists
        const clonedRequest = accessToken
            ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${accessToken}`) })
            : req;

        return next.handle(clonedRequest).pipe(
            catchError((error) => {
                console.log(error)
                if (error.status === 401) {
                    return this.handle401Error(req, next);
                }
                return throwError(() => error);
            })
        );
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let refreshToken = this.authService.getRefreshToken();
        return this.authService.refresh(refreshToken!).pipe(
            switchMap((response) => {
                // Update tokens in the AuthService
                this.authService.setSession(response.result?.token!, response.result?.refreshToken!);

                // Retry the failed request with the new access token
                const newRequest = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${response.result?.token}`)
                });
                return next.handle(newRequest);
            }),
            catchError((refreshError) => {
                // If refresh fails, log out and redirect to login
                this.authService.logout();
                this.router.navigate(['/login']);
                return throwError(() => refreshError);
            })
        );
    }
}
