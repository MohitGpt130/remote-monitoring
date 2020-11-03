import { ClientService } from './../../client.service';
import { DataService } from './../data.service';
import { AuthService } from './../../auth/auth.service';
import { RejectreworkComponent } from '../manualentry/rejectrework/rejectrework.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RejectQuantityFormComponent } from './machine-parameters-charts/reject-quantity-form/reject-quantity-form.component';
import { ShiftEndFormComponent } from './machine-parameters-charts/shift-end-form/shift-end-form.component';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { Router, NavigationError, RouteConfigLoadEnd, NavigationEnd, NavigationStart, Event } from '@angular/router';
import { Subscription, Subject, Observable, interval } from 'rxjs';

import { DomSanitizer } from '@angular/platform-browser';
import { BatchskuentryComponent } from '../manualentry/batchskuentry/batchskuentry.component';

@Component({
  selector: 'app-live-views',
  templateUrl: './live-views.component.html',
  styleUrls: ['./live-views.component.scss']
})
export class LiveViewsComponent implements OnInit, OnChanges, OnDestroy {
  isLoaded = false;
  activeLink: string = 'Table';
  showProcess: boolean = true;

  gotData = {
    Table: true,
    Charts: true,
    Process: true,
  };

  isDarkTheme: Observable<boolean>;
  currentUser;

  skuName;
  OperatorName;
  skuNameDefinations = [
    '',
    'Product A',
    '5 LITRE FORTUNE',
    '2 LITRE KING',
    '5 LITRE KING',
    '5 LITRE PET',
  ];
  displayedColumns: string[];
  tableData;
  connectionStatus;
  tableDataAsObject;
  tableParameters;

  nestedRoute;

  machines;
  statusColors;
  colorStatus;
  machinesStatus;

  machineWiseFaultsTableData;
  machineWiseFaults;

  faultDescritions;

  getEventsUpdate = false;
  getPieUpdate = false;

  gotTableData: boolean = false;
  gotEventChartData: boolean = false;
  gotPieChartData: boolean = false;
  gotConnectionData: boolean = false;
  gotLineChartData = false;
  gotCriticalMachineData: boolean = false;

  selectedButton = 'count';

  dashboard;

  eventBarChartData;
  pieChartsData;
  lineChartData;
  criticalMachineData;

  headerInfo;
  alarmsData;
  criticalMachineParameters;

  stockQuote: number;
  sub: Subscription;
  product;
  slideUrl;
  connectionDef;
  output;
  changeover;
  fault;


  constructor(
    // private socketappDataService: SocketappDataService,
    private appDataService: DataService,
    private authService: AuthService,
    private clientService: ClientService,

    public dialog: MatDialog,
    private router: Router,
    private httpClient: HttpClient,
    public sanitizer: DomSanitizer
  ) {
    //console.log(router.url.split('/'));
    if (router.url.split('/').length > 1) {
      this.nestedRoute = router.url.split('/')[4];
      console.log(this.nestedRoute);
    }

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        if (router.url.split('/').length > 1) {
          this.nestedRoute = router.url.split('/')[4];
          console.log(this.nestedRoute);
        }
      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }

      if (event instanceof RouteConfigLoadEnd) {
      }
    });
  }

  ngOnInit() {
    console.log(this.nestedRoute);

    this.currentUser = this.authService.currentUserSubject.value;
    this.faultDescritions = this.appDataService.faultDescritions;
    this.machines = this.appDataService.machines;

    this.httpClient.get('configs/apix/data_pattern.json').subscribe((res: any) => {
      this.statusColors = res.status_color;
      this.faultDescritions = res.faultDescritions;
    });

    this.httpClient
      .get('configs/apix/api_server.json')
      .subscribe((data: any) => {
        this.httpClient.get(this.clientService.apiConfigs.dashboardAPI + '/api/shift/shift/all?line_id=5f0809fdc2b1ce30cc53eb8d').subscribe((shiftData: any) => {
          this.headerInfo = {};
          this.headerInfo.currentTime = shiftData[0].current_timeStamp;
          this.headerInfo.loadUpdatedTime = shiftData[0].last_updated;
          this.headerInfo.currentShift = shiftData[0].shift;
          this.isLoaded = true;
        });

        this.connectionDef = data.connection;
        if (data['server']) {
          this.appDataService.getInit(data);
          this.isLoaded = true;
        } else {
          //console.log('missing server api json file');
        }

        if (data.server !== undefined) {
          this.appDataService.getInit(data);
          this.product = data.product;
          if (data.slidesUrl && data.slidesUrl.line) {
            this.slideUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              data.slidesUrl.line
            );

            this.output = this.sanitizer.bypassSecurityTrustResourceUrl(data.slidesUrl.output);
            this.changeover = this.sanitizer.bypassSecurityTrustResourceUrl(data.slidesUrl.changeover);
            this.fault = this.sanitizer.bypassSecurityTrustResourceUrl(data.slidesUrl.fault);
          }
        } else {
          //console.log('missing server api json file');
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

    this.dashboard = JSON.parse(localStorage.getItem('dashboard'));
    // this.sub = this.socketappDataService.getQuotes().subscribe(quote => {
    //   this.stockQuote = quote;
    // });

    // this.sub = this.appDataService.getEventChartData().subscribe(data => {
    //   this.eventBarChartData = data;
    // });

    this.sub = this.appDataService.getEventChartData().subscribe((data) => {
      this.eventBarChartData = data;
      this.gotEventChartData = true;
      this.getEventsUpdate = !this.getEventsUpdate;
      // this.gotEventChartData = false;
      console.log(this.getEventsUpdate)
      
    });

    this.sub = this.appDataService.getPieChartData().subscribe((data) => {
      this.pieChartsData = data;
      this.gotPieChartData = true;
      this.getEventsUpdate = !this.getEventsUpdate;
      
      // this.getPieUpdate = !this.getPieUpdate;
    });

    // this.sub = this.appDataService.getMachineParametersTableData().subscribe(data => {
    // });
  }

  ngOnChanges() {}

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleDarkTheme(checked: boolean) {}

  getShiftEndForm() {
    const dialogRef = this.dialog.open(ShiftEndFormComponent, {
      width: '650px',
      height: '700px',
      data: {
        dataKey: {
          Shiftname: this.headerInfo.currentShift,
          Shiftdate: this.headerInfo.currentTime,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log(`Dialog result: ${result}`);
    });
  }
  getRejectQuanityForm() {
    const dialogRef = this.dialog.open(RejectQuantityFormComponent, {
      width: '650px',
      height: '700px',
      data: {
        dataKey: {
          Shiftname: this.headerInfo.currentShift,
          Shiftdate: this.headerInfo.currentTime,
        },
      },
    });
    //console.log(this.headerInfo.currentShift);

    // dialogRef.afterClosed().subscribe(result => {
    //   //console.log(`Dialog result: ${result}`);
    // });
  }

  changeSKU() {
    console.log(this.headerInfo);
    const dialogRef = this.dialog.open(BatchskuentryComponent, {
      width: '580px',
      height: '500px',
      data: {
        dataKey: {
          Shiftname: this.headerInfo.currentShift,
          Shiftdate: this.headerInfo.currentTime,
        },
      },
    });
    //console.log(this.headerInfo.currentShift);
  }
  rejectrework() {
    const dialogRef = this.dialog.open(RejectreworkComponent, {
      width: '550px',
      height: '600px',
      data: {
        dataKey: {
          Shiftname: this.headerInfo.currentShift,
          Shiftdate: this.headerInfo.currentTime,
        },
      },
    });
    //console.log(this.headerInfo.currentShift);
  }
}
