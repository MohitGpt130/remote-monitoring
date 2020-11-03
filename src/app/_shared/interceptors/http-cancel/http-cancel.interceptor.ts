import { HttpCancelService } from './http-cancel.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Injectable()
export class HttpCancelInterceptor implements HttpInterceptor {
  constructor(private httpCancelService: HttpCancelService) { }

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()))
  }
}
