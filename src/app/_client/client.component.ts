import { environment } from './../../environments/environment';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ClientService } from './client.service';
import { ThemeService } from './theme.service';
import {
  Router,
  NavigationStart,
  Event,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppSettings } from './app.settings';
import { AuthService } from './auth/auth.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, AfterViewChecked {
  isDarkTheme: Observable<boolean>;

  env: any = environment;
  appName = environment.title;
  appVersion = environment.version;
  buildDate = new Date(environment.timestamp);
  updateDaysDiff = moment().diff(this.buildDate, 'days');

  currentUser;
  connectionsCountSub: Subscription;
  connectionsCount;

  connectionStatusSub: Subscription;
  connectionStatus;

  connectionStabledSub: Subscription;
  isConnected = true;

  connectionAuthStabledSub: Subscription;

  dashboardSettingsSub: Subscription;
  dashboardSettings;
  apiConfigs;

  isLoaded = false;

  public settings;

  constructor(
    private themeService: ThemeService,
    private appService: ClientService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    public appSettings: AppSettings,
    private title: Title,
    private toastr: ToastrService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.spinner.show();

    setTimeout(() => this.spinner.hide(), 2000);

    // this.httpClient
    //   .get('https://config-api.smartfactoryworx.net/services/ajay/fake-api/test1')
    //   .subscribe(
    //     (d) => console.log(d),
    //     (er) => console.log(er)
    //   );

    this.appService.getDashboardSettings().then((data: any) => {
      this.title.setTitle(this.env.title);
      this.apiConfigs = data.apiConfigs;
      this.dashboardSettings = data.dashboardConfigs;
      this.isLoaded = true;
    });

    this.connectionsCountSub = this.appService
      .getConnectionsCount()
      .subscribe((data) => {
        this.connectionsCount = data;
        console.log('connections:' + this.connectionsCount);
      });

    this.connectionStatusSub = this.appService
      .getConnectionStatus()
      .subscribe((data: any) => {
        this.connectionStatus = data.status;
      });

    this.connectionStabledSub = this.appService
      .getConnectionStabled()
      .subscribe((data) => {
        this.isConnected = data;
      });

    this.connectionAuthStabledSub = this.appService
      .getConnectionAuth()
      .subscribe((data) => {

        
        
        
        // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // const returnUrl = this.router.url;

        if (this.authService.currentUserValue) {
          if (
         this.authService.currentUserValue.email === data.email &&
            this.authService.currentUserValue.jwtToken !== data.jwtToken
          
            )
            
            {
            if(data.jwtToken) {
              this.authService.logout();
              console.log("Its working")
            }
          } else {
            if (this.authService.currentUserValue.email === 'admin@smartfactoryworx.com') {
              this.router.navigate(['/sfw/admin']);
            } else {
              const returnUrl = this.route.snapshot.queryParams['returnUrl'];
              if(returnUrl) {
                this.router.navigate([returnUrl]);
              }
            }
          }
        } else {
          this.authService.logout();
        }
      });
      

    this.connectionStabledSub = this.appService
      .getConnectionStabled()
      .subscribe((data) => {
        this.isConnected = data;
      });

    this.appService.getActivityCommands().subscribe((command: any) => {
      this.activityCommander(command.subject, command.object, command.info);
    });
  }

  ngAfterViewChecked(): void {}

  activityCommander(subject: any, object: string, info: any): void {
    switch (object) {
      case 'reload':
        if (subject) {
        } else {
          location.reload();
        }
        break;
      case 'changeRoute':
        if (subject) {
        } else {
          this.router.navigate([info.route]);
        }
        break;
      case 'exit':
        if (subject) {
        } else {
          window.open('', '_self').close();
        }
        break;

      case 'notify':
        this.toastr.success('Loaded Successfully!!', 'SmartFactoryWorx.com');
        break;

      default:
        break;
    }
  }
}
