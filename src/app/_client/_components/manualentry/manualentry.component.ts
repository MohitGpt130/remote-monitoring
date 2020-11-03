import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit, NgModule, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-manualentry',
  templateUrl: './manualentry.component.html',
  styleUrls: ['./manualentry.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManualentryComponent implements OnInit {
  headerInfo;
  sub: Subscription;
  connectionStatus;
  skuName;
  dashboard;
  skuNameDefinations = [
    '',
    'Product A',
    '5 LITRE FORTUNE',
    '2 LITRE KING',
    '5 LITRE KING',
    '5 LITRE PET',
  ];
  gotConnectionData: boolean = false;
  product;
  currentUser;
  OperatorName;

  constructor(
    // private socketAppDataService: SocketAppDataService,
    private authService: AuthService,
    private appDataService: DataService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    console.log('1sddfsdfsdfsdfsdf');
    this.currentUser = this.authService.currentUserSubject.value;
    console.log(this.currentUser);

    this.httpClient
      .get('configs/apix/api_server.json')
      .subscribe((data: any) => {
        if (data.server !== undefined) {
          this.appDataService.getInit(data);
          this.product = data.product;
        } else {
          console.log('missing server api json file');
        }
      });
    setInterval(() => {
      if (this.headerInfo !== undefined) {
        this.headerInfo.currentTime = new Date(
          new Date(this.headerInfo.currentTime).setSeconds(
            new Date(this.headerInfo.currentTime).getSeconds() + 1
          )
        );
        //console.log(this.headerInfo.currentTime);
      }
    }, 1000);
  }

  logout() {
    this.authService.logout();
  }
}
