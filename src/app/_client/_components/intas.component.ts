import { AuthService } from './../auth/auth.service';
// import { AuthService } from './../../_outlets/auth/auth.service';
import { ModuleService } from './module.service';


import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';

import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';

ModuleService
AuthService
AuthService

@Injectable()
// export class ThemeService {
//   private _darkTheme = new Subject<boolean>();
//   isDarkTheme = this._darkTheme.asObservable();

//   setDarkTheme(isDarkTheme: boolean): void {
//     this._darkTheme.next(isDarkTheme);
//   }
// }

@Component({
  selector: 'app-intas',
  templateUrl: './intas.component.html',
  styleUrls: ['./intas.component.scss'],
})
export class IntasComponent implements OnInit {
  title = 'Intas-v1';
  permissions;
  currentUser;

  isDarkTheme: Observable<boolean>;

  stockQuote: number;

  connectionsCountSub: Subscription;
  connectionStateSub: Subscription;
  sub: Subscription;
  connectionsCount;
  isConnected = true;

  constructor(
    // private themeService: ThemeService,
    private appService: ModuleService,
    private authService: AuthService,
    private router: Router,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    // this.isDarkTheme = this.themeService.isDarkTheme;
    this.route();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route();
      }
    });

    this.connectionsCountSub = this.appService
      .getConnectionsCount()
      .subscribe((data) => {
        this.connectionsCount = data;
        console.log('users connected:' + this.connectionsCount);
      });

    this.connectionStateSub = this.appService
      .getConnection()
      .subscribe((data) => {
        this.isConnected = data;
      });
  }

  route(): void {
    if (this.authService.currentUserValue) {
      if (!this.authService.currentUserValue.user.auth.isSuper) {
        const authRouteAPI = 'https://intasua.smartfactoryworx.tech/api/v1/admin/users/' + this.authService.currentUserValue.email + '/access-routes';
        console.log(authRouteAPI);
        this.httpClient.get(authRouteAPI).subscribe(
          (accessRoutes: any) => {

            if (accessRoutes.includes(this.router.url)) {
              this.router.navigate([this.router.url]);

              // if (this.router.url !== '/lineview/table/count') {
              //   this.router.navigate([this.router.url]);
              // } else {
              //   this.router.navigate([this.authService.currentUserValue.user.settings.homeRoute]);
              // }
            } else {
              if (this.router.url === '/sfw/intas/dashboard/line1') {
                this.router.navigate([this.authService.currentUserValue.user.settings.homeRoute]);
              } else {
                // if (accessRoutes.includes(this.authService.currentUserValue.user.settings.homeRoute)) {
                //   this.router.navigate([this.authService.currentUserValue.user.settings.homeRoute]);
                // }
                if (!this.router.url.includes('/auth/un-authorized')){
                  this.router.navigate(['/auth/un-authorized'], {
                    queryParams: { unAuthorizedUrl: this.router.url },
                  });
                }
              }

              // this.router.navigate(['/auth/un-authorized'], {
              //   queryParams: { unAuthorizedUrl: this.router.url },
              // });
            }
          },
          (err) => this.router.navigate(['/auth/un-authorized'])
        );
      }
    }
  }

  // toggleDarkTheme(checked: boolean): void {
  //   this.themeService.setDarkTheme(checked);
  // }
}
