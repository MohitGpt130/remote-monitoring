import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ClientService,  } from '../../client.service';
import { AppSettings } from '../../app.settings';

@Component({
  selector: 'app-un-authorized',
  templateUrl: './un-authorized.component.html',
  styleUrls: ['./un-authorized.component.scss']
})
export class UnAuthorizedComponent implements OnInit, AfterViewInit {

  public settings: any;
  public unAuthorizedUrl;
  public isVerified;
  public message;
  constructor(
    public appSettings: AppSettings,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
  ) {
    this.settings = this.appSettings.settings;

  }

  goHome(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('unauthorizedpraama',params)
      this.unAuthorizedUrl = params.unAuthorizedUrl;
    });
    // this.authService.logout();
  }

  ngAfterViewInit(): void {
    this.settings.loadingSpinner = false;
  }

}
