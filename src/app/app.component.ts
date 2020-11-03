import { ClientService } from './_client/client.service';
import { AppSettings } from './_client/app.settings';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';

import { AppService } from './app.service';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoaded = false;

  isDarkTheme: Observable<boolean>;

  env: any = environment;
  appName = environment.title;
  appVersion = environment.version;
  buildDate = new Date(environment.timestamp);
  updateDaysDiff = moment().diff(this.buildDate, 'days');

  connectionStatusSub: Subscription;
  connectionStatus;

  connectionsCountSub: Subscription;
  connectionsCount;

  connectionStabledSub: Subscription;
  isConnected = false;

  connectionAuthStabledSub: Subscription;
  configs;

  public settings;

  constructor(
    private spinner: NgxSpinnerService,
    private themeService: ThemeService,
    private title: Title,
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    private clientService: ClientService,
    private apiService: ApiService,
    public appSettings: AppSettings,
    private socketService: SocketService,
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.title.setTitle(this.env.title);
    // this.spinner.show();

    setTimeout(() => this.spinner.hide(), 2000);

    this.apiService.getConfigs().subscribe(configs => {
      this.configs = configs;
      this.clientService.getDashboardSettings().then((data: any) => {
        this.title.setTitle(this.env.title);
        this.isLoaded = true;
      });
      // this.spinner.hide();
    });



    this.connectionsCountSub = this.socketService
      .getConnectionsCount()
      .subscribe((data) => {
        this.connectionsCount = data;
        console.log('connections:' + this.connectionsCount);
      });

    this.connectionStatusSub = this.socketService
      .getConnectionStatus()
      .subscribe((data: any) => {
        console.log(data);
        this.connectionStatus = data.status;
      });

    this.connectionStabledSub = this.socketService
      .getConnectionStabled()
      .subscribe((data) => {
        this.isConnected = data;
      });

    this.connectionAuthStabledSub = this.socketService
      .getConnectionAuth()
      .subscribe((data) => {
        // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // const returnUrl = this.router.url;
      });

    this.connectionStabledSub = this.socketService
      .getConnectionStabled()
      .subscribe((data) => {
        this.isConnected = data;
      });

    this.socketService.getActivityCommands().subscribe((command: any) => {
      this.activityCommander(command.subject, command.object, command.info);
    });
  }

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
