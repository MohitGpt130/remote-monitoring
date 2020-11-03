import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ClientService,} from '../../client.service';
import { AppSettings } from '../../app.settings';

@Component({
  selector: 'app-verify-token',
  templateUrl: './verify-token.component.html',
  styleUrls: ['./verify-token.component.scss']
})
export class VerifyTokenComponent implements OnInit, AfterViewInit {
  isLoaded = false;

  public settings: any;
  public token;
  public isVerified;
  public message;
  constructor(
    public appSettings: AppSettings,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public appService: ClientService,
  ) {
    this.settings = this.appSettings.settings;
    this.appService
    .getDashboardSettings()
    .then((configs: any) => {
      console.log(configs);
      this.isLoaded = true;
      this.route.params.subscribe((params) => {
        this.token = params.token;
        this.authService.verifyToken(this.token).subscribe((data: any) => {
          if (data.isVerified) {
            this.isVerified = true;
            this.message = 'Congratulation, your email has been verified, now you can login.';
          } else {
            this.isVerified = false;
            this.message = 'Sorry, verification code is wrong or expired, contact with administrator and request for resend verification code';
          }
        }, err => {
          this.message = err;
        });
      });
    });
  }

  goHome(): void {
    if(this.appService.dashboardConfigs.withAdmin) {
      this.router.navigate(['/auth/login']);
    } else {
      document.location.href = this.appService.apiConfigs.dashboardUrl;
    }
  }

  ngOnInit(): void {

    // this.authService.logout();
  }

  ngAfterViewInit(): void {
    this.settings.loadingSpinner = false;
  }

}
