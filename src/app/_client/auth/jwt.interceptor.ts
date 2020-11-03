import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  currentUser;
  authJWTToken;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, public router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.currentUser && this.authJWTToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authJWTToken}`,
          User: this.currentUser.email,
        }
      });
    }
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.authService.logout();
        const error = err.error.message || err.statusText;
        // this.snackBar.open('jwt expired', err.error.title, { duration: 10000 });
        this.router.navigateByUrl('/auth/login');
        // location.reload();
      }
      return throwError(err);
    }));
  }
}
