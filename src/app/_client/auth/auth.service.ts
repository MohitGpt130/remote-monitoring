import { Injectable, NgModule, OnInit } from '@angular/core';
import { Observable, Observer, BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../client.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  public apiConfigs;
  authObserver = new BehaviorSubject(null);

  socket;
  returnUrl;
  connectionStabledObserver: Observer<boolean>;

  constructor(
    // private authSocket: AuthSocket,
    public httpClient: HttpClient,
    public router: Router,
    public route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private appService: ClientService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();

    this.httpClient
      .get('configs/sockets.config.json')
      .subscribe((socketConfigs: any) => {
        const socketUrl = socketConfigs.admin.users;
        this.socket = this.appService.activateSocket(socketUrl, null);
        this.socket.emit('get', {data: 'users'});
        this.socket.on('data', (data) => {
          this.authObserver.next(data);
        });

        this.socket.on('login', (data) => {
          this.authObserver.next(data);
        });
      });
  }

  public get currentUserValue(): any {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    return this.currentUserSubject.value;
  }

  login(loginDto): Observable<any> {
    return this.httpClient.post<any>(this.appService.apiConfigs.apis.auth.login, loginDto).pipe(
      map((response) => {
        const currentUser = response;
        this.currentUserSubject.next(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.appService.socket.emit('auth', currentUser);
        this.appService.socket.emit('activity', { email: currentUser.user.email, activity: 'login', subject: 'selft' });
        this.snackBar.open('welcome to dashboard', '', { duration: 2000 });
        return response;
      })
    );
  }

  register(registrationForm: object): Observable<any> {
    return this.httpClient
      .post<any>(this.appService.apiConfigs.apis.auth.register, registrationForm)
      .pipe(
        map((user) => {
          return user;
        })
      );
  }

  verifyToken(token): Observable<any> {
    return this.httpClient.post(this.appService.apiConfigs.apis.auth.verifyToken + token, { });
  }

  // verifyToken(email, token): Observable<any> {
  //   return this.httpClient.post(this.appService.apiConfigs.apis.auth.verifyToken + token, { email });
  // }

  resetRequest(email): Observable<any> {
    return this.httpClient.post(this.appService.apiConfigs.apis.auth.resetRequest + email, {});
  }

  resetpassword(email, token, newPassword): Observable<any> {
    return this.httpClient.post(this.appService.apiConfigs.apis.auth.resetPassword + token, {
      email,
      newPassword,
    });
  }

  logout(): void {
    if(this.currentUserValue) {
      this.appService.socket.emit('auth', {
        email: this.currentUserValue.email,
        jwtToken: null,
      });
      // this.appService.socket.emit('auth', null);
    }
    localStorage.clear();
    this.currentUserSubject.next(null);
    const returnUrl = this.router.url.includes('?') ? this.router.url.includes('?')[0] : this.router.url;
    console.log(returnUrl)
    if(returnUrl) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl } });
    }
    // location.reload();
  }

  resetPasswordVerifyToken(token) {
    return this.httpClient.post(this.appService.apiConfigs.apis.auth.resetPasswordVerifyToken + token, {});
  }

  unauthorizedAcess(messege): void {
    this.snackBar.open(messege, 'un-authorized access', { duration: 3000 });
  }
}
