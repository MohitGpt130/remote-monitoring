import { ModuleService } from './../../module.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Screen1Service {

  constructor(private http: HttpClient, private appService: ModuleService) { }

  screen1FaultData(): Observable<any> {
    if(!this.appService.configs) {
      return this.http.get<any>('/api/v1/live-api/avod-tv-screen1');
    } else {
      return this.http.get<any>(this.appService.configs.screen1.api);
    }
  }

  getScreenConfigs(): Observable<any> {
    if(!this.appService.configs) {
      return this.http.get<any>('/samples/avod-tv-screen-def.json');
    } else {
      return this.http.get<any>(this.appService.configs.screenConfigs.api);
    }
  }
}
