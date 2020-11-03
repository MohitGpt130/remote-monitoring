import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  public currentUserRoles = [];
  public currentUser;

  constructor(public authService: AuthService, public router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.currentUser = this.authService.currentUserValue;
    console.log(this.currentUser);
    if (this.currentUser && this.currentUser.user && this.currentUser.user.auth.isSuper) {
      return true;
    } else {
      if (this.currentUser && this.currentUser.user && this.currentUser.user.roles && this.currentUser.user.roles.length>0) {
        this.currentUserRoles = [];
        this.currentUser.user.roles.forEach(role => this.currentUserRoles.push(role.name));
        if (this.currentUserRoles.length > 0 && this.currentUserRoles.some((role) => next.data.roles.includes(role)))  {
          return true;
        } else {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
          this.authService.snackBar.open('You are not authorized for ' + JSON.stringify(next.data.roles) + ' roles access', '', {duration: 5000});
          return false;
        }
      } else {
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        this.authService.snackBar.open('You are not authorized for ' + JSON.stringify(next.data.roles) + ' roles access', '', {duration: 5000});
        return false;
      }
    }
  }
}
