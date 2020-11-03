import { HttpClient } from '@angular/common/http';
import { Observer, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// export class Settings {
//   constructor(
//     public name: string,
//     public loadingSpinner: boolean,
//     public fixedHeader: boolean,
//     public sidenavIsOpened: boolean,
//     public sidenavIsPinned: boolean,
//     public sidenavUserBlock: boolean,
//     public menu: string,
//     public menuType: string,
//     public theme: string,
//     public rtl: boolean
//   ) {}
// }

// public settings = new Settings(
//   'SmartFactoryWorx', //theme name
//   true, //loadingSpinner
//   true, //fixedHeader
//   true, //sidenavIsOpened
//   true, //sidenavIsPinned
//   false, //sidenavUserBlock
//   'vertical', //horizontal , vertical
//   'mini', //default, compact, mini
//   'indigo-light', //indigo-light, teal-light, red-light, blue-dark, green-dark, pink-dark
//   false // true = rtl, false = ltr
// );

@Injectable()
export class AppSettings {
  settingObserver: Observer<any>;

  public settings = {
    name: 'SmartFactoryWorx',
    settingOption: {
      visible: false,
    },
    loadingSpinner: true,
    fixedHeader: true,
    sidenavIsOpened: true,
    sidenavIsPinned: true,
    sidenavUserBlock: true,
    menu: 'vertical',
    menuType: 'mini',
    theme: 'indigo-light',
    rtl: false,
  };

  constructor(private httpClient: HttpClient) {
  }

  getAppSettings(): Observable<any>{
    this.httpClient.get('configs/dashboard.config.json').subscribe((dashboardConfigs: any) => {
      this.settings = dashboardConfigs.layoutSettings;
      this.settingObserver.next(dashboardConfigs.layoutSettings);
    })
    return new Observable((observer) => {
      this.settingObserver = observer;
    });
  }

  setAppSettings(settings) {
    this.settings = settings;
  }
}
