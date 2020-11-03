import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  public currentUser;

  constructor(private router: Router, private authService: AuthService) {}

   canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      return true;
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      this.authService.snackBar.open('You are not authorized for ' + JSON.stringify(next.data.roles) + ' roles access', '', {duration: 5000});
    }
    // return false;
  }
}
