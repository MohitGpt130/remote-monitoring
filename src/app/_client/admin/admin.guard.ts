import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  public currentUserRoles = [];
  public currentUser;

  constructor(public authService: AuthService, public router: Router, private route: ActivatedRoute) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

      this.currentUser = this.authService.currentUserValue;
      if (this.currentUser) {
        if (this.currentUser.user.auth.isSuper) {
          return true;
        } else {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
          this.authService.snackBar.open('You are not authorized for ' + JSON.stringify(next.data.roles) + ' roles access', '', {duration: 5000});
          return false;
        }
      }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.currentUser = this.authService.currentUserValue;
    return this.canActivate(next, state);
  }

}

