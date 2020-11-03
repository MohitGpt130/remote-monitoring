import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ClientService } from '../../client.service';
import { FormControl } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ResetRequestComponent } from '../reset-request/reset-request.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppSettings } from '../../app.settings';

@Component({
  selector: 'app-verify-token',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  isLoaded = false;
  public resetPasswordForm: FormGroup;

  submitted = false;
  data: any;

  returnUrl: string;
  loading = false;
  newPassword1: FormControl;
  newPassword2: FormControl;
  public settings: any;
  public token;
  public isVerified;
  public message;
  public newPassword;
  public email;
  constructor(
    public appSettings: AppSettings,
    public router: Router,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public authService: AuthService,
    public appService: ClientService,
    public snackBar: MatSnackBar
  ) {
    this.settings = this.appSettings.settings;
    this.resetPasswordForm = this.fb.group({
      newPassword1: [
        null,
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      newPassword2: [
        null,
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.settings = this.appSettings.settings;
    this.appService.getDashboardSettings().then((configs: any) => {
      console.log(configs);
      this.isLoaded = true;
      this.route.params.subscribe((params) => {
        this.token = params.token;
        this.email = params.email;
        // console.log(params); //working
        this.authService.resetPasswordVerifyToken(this.token).subscribe(
          (data: any) => {
            console.log(data);
            this.data = data;
            if (data && data.isVerified) {
              this.isVerified = true;
            } else {
              this.message = 'Sorry, verification code is wrong or expired, contact with administrator and request for resend verification code';
            }
          },
          (err) => {
            this.isVerified = false;
            this.message = err;
          }
        );
        this.resetPasswordForm = this.fb.group({
          newPassword1: [
            null,
            Validators.compose([Validators.required, Validators.minLength(6)]),
          ],
          newPassword2: [
            null,
            Validators.compose([Validators.required, Validators.minLength(6)]),
          ],
        });
      });
    });
  }

  saveNewPassword(newPassword: string) {
    const email = this.email;
    const token = this.token;
    this.authService.resetpassword(email, token, newPassword).subscribe(
      (data) => {
        this.snackBar.open('Password successfully changed', '', {
          duration: 2000,
        });
        let returnUrl;
        if (this.authService.currentUserValue) {
          const cUser = this.authService.currentUserValue.user;
          if (cUser.settings && cUser.settings.homeRoute) {
            returnUrl = cUser.settings.homeRoute;
          }
          else {
            returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          }
          this.router.navigate([returnUrl]);
        }
      },
      (error) => {
        this.snackBar.open(
          null,
          'Some issue was faced in changing the password.'
        );
      }
    );
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }
}
