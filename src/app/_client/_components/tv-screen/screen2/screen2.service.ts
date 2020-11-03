import { ModuleService } from './../../module.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Screen2Service {
  constructor(private httpClient: HttpClient, private appService: ModuleService) {}

  getScreen2Data(): Observable<any> {
    if(!this.appService.configs) {
      // return this.httpClient.get<any>('http://13.127.210.191/services/prachi20/fake-api/screen2');
      return this.httpClient.get<any>('/api/tv/avod-tv-screen2');

    } else {
      return this.httpClient.get<any>(this.appService.configs.screen2.api);
    }
  }

  getScreenConfigs(): Observable<any> {
    if(!this.appService.configs) {
      return this.httpClient.get<any>('/tv-screen/samples/avod-tv-screen-def.json');
    } else {
      return this.httpClient.get<any>(this.appService.configs.screenConfigs.api);
    }
  }
}
