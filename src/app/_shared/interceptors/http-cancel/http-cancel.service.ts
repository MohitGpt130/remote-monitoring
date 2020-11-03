import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpCancelService {
  private cancelPendingRequests$ = new Subject<void>();

  constructor() { }

  /** Cancels all pending Http requests. */
  public cancelPendingRequests() {
    this.cancelPendingRequests$.next();
  }

  public onCancelPendingRequests() {
    return this.cancelPendingRequests$.asObservable();
  }

}
