import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AppSettings } from '../../app.settings';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm: FormGroup;
  public settings: any;
  public passwordHide = true;

  returnUrl;

  constructor(
    public appSettings: AppSettings,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    public snackbar: MatSnackBar,
    private authService: AuthService,
  ) {
    this.settings = this.appSettings.settings;
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'),
        ]),
      ],
      password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  ngOnInit(): void {
    if(this.authService.currentUserValue) {
      const cUser = this.authService.currentUserValue.user;
      if (cUser.settings && cUser.settings.homeRoute) {
        this.returnUrl = cUser.settings.homeRoute;
      }
      else {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      }
      this.router.navigate([this.returnUrl]);
    }
  }

  ngAfterViewInit(): void {
    this.settings.loadingSpinner = false;
  }

  public onSubmit(values: any): void {
    if (this.loginForm.valid) {
      this.authService.login({username: values.email, password: values.password }).subscribe(res => {
        this.authService.currentUserSubject.next(res);
        if (this.authService.currentUserValue) {
          const cUser = this.authService.currentUserValue.user;
          if (cUser.settings && cUser.settings.homeRoute) {
            this.returnUrl = cUser.settings.homeRoute;
          }
          else {
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          }
          this.router.navigate([this.returnUrl]);
        }
        // location.reload();
      }, err => this.snackbar.open(err.error && err.error.message ? err.error.message : 'Sorry not able to login' ));
    }
  }
}


@Component({
  selector: 'app-logout',
  template: `
    <div>
      logout
    </div>
  `,
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authService.logout();
  }
}
