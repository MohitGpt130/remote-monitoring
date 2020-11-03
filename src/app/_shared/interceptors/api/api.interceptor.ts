import { LoaderService } from './loader.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  currentUser;
  dashboardAuthToken;

  constructor(
    private snackBar: MatSnackBar, public router: Router,
    private httpClient: HttpClient,
    public loaderService: LoaderService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.dashboardAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lc3BhY2UiOiJhamF5IiwiaWF0IjoxNTkyMjIyNzE4LCJleHAiOjE1OTIyODI3MTh9.sU1-Fo_0XO1axAJtZf562mMtMaVfQzSq1FT5XdzXbVQ';
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.dashboardAuthToken}`,
      }
    });

    console.log('request started');

    this.loaderService.show();
    return next.handle(request).pipe(
        finalize(() => {
          this.loaderService.hide();
        // setTimeout(() => this.loaderService.hide(), 2000);

        }), catchError(err => {
          console.log(err);
          const error = err.error.message || err.statusText;
          // this.snackBar.open(error, err.error.title, { duration: 10000 });
          return throwError(err);
        })
    );
  }
}
