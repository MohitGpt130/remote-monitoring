import { ClientService } from './../../../client.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-sfw-header',
  templateUrl: './sfw-header.component.html',
  styleUrls: ['./sfw-header.component.scss']
})
export class SfwHeaderComponent implements OnInit {
  @Input() displayData: any;
  @Input() timeFormat: any;
  now: any = moment().format('Do MMMM YYYY, h:mm:ss a');

  @Output() logout: EventEmitter<any> = new EventEmitter<any>();

  connectionStatus;
  headerInfo: any = {};

  headerDataLoaded = false;

  constructor(
    private httpClient: HttpClient,
    private clientService: ClientService,

  ) { }

  ngOnInit(): void {
    if(!this.displayData) {
      this.displayData = { name: 'SFW-Header' };
    }

    JSON.parse(localStorage.getItem('currentUser'))? this.headerInfo.user = JSON.parse(localStorage.getItem('currentUser')).user : null;

    if(!this.timeFormat) {
      this.timeFormat = 'Do MMMM YYYY, h:mm:ss a';
    }

    this.httpClient.get(this.clientService.apiConfigs.dashboardAPI + '/api/manual/shift?line_id=5f0809fdc2b1ce30cc53eb8d').subscribe((shifts: any) => {
      this.getData(shifts);
      setInterval(() => {
        this.getData(shifts);
      }, 60000);
    });

    setInterval(() => {
      this.now = moment().format(this.timeFormat);
    }, 1000);
  }

  getData(shifts) {
    this.httpClient.get(this.clientService.apiConfigs.dashboardAPI + '/api/shift/shift/all?line_id=5f0809fdc2b1ce30cc53eb8d').subscribe((shiftData: any) => {
      this.headerInfo.currentTime = shiftData[0].current_timeStamp;
      this.headerInfo.loadUpdatedTime = shiftData[0].last_updated;

      this.headerInfo.currentShift = shiftData[0].shift;
      const shiftDef = shifts.filter(s => s.shift === shiftData[0].shift);
      shiftDef.length > 0 ? this.headerInfo.startTime = shiftDef[0].shiftStartTime : '-';
      this.headerDataLoaded = true;
    });

    this.httpClient.get(this.clientService.apiConfigs.dashboardAPI + '/api/connection').subscribe((connection: any) => {
      this.connectionStatus = connection[0]
    });
  }

  onLogout() {
    localStorage.clear();
    this.logout.emit();
    location.reload();
  }

}
