import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-request',
  templateUrl: './reset-request.component.html',
  styleUrls: ['./reset-request.component.scss']
})
export class ResetRequestComponent implements OnInit {

  constructor(
    public router: Router,
    private authService: AuthService,
    public route: ActivatedRoute,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  resetRequest(email) {
    this.authService.resetRequest(email).subscribe(
      data => {
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
        this.snackBar.open('Check your Email and reset your Password.', '', { duration: 2000 });
      },
      error => {
        this.snackBar.open(null, 'Reset Link not sent, Enter your Email again')
      }
    );

  }

}
