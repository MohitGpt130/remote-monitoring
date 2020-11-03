import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.settings';

@Component({
  selector: 'app-time-zone-menu',
  templateUrl: './time-zone-menu.component.html',
  styleUrls: ['./time-zone-menu.component.scss']
})
export class TimeZoneMenuComponent implements OnInit {

  public settings: any;
  constructor(public appSettings: AppSettings){
      this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
  }

}
