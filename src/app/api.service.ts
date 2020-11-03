import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  configs: any;

  apiConfigs: any;

  configsObserver: Observer<any>;

  constructor(private httpClient: HttpClient) {}

  getConfigs(): Observable<any> {
    this.configs = {};
    this.httpClient.get('configs/api.config.json').subscribe((apiConfig) => {
      this.apiConfigs = apiConfig;
      this.configs.apiConfig = apiConfig;
      this.httpClient
        .get('configs/dashboard.config.json')
        .subscribe((dashboardConfig) => {
          this.configs.dashboardConfig = dashboardConfig;
          this.httpClient
            .get('configs/layout.config.json')
            .subscribe((layoutConfig) => {
              this.configs.layoutConfig = layoutConfig;
              this.httpClient
                .get('configs/sockets.config.json')
                .subscribe((socketConfig) => {
                  this.configs.socketConfig = socketConfig;
                  this.configsObserver.next(this.configs);
                });
            });
        });
    });
    return new Observable((observer) => {
      this.configsObserver = observer;
    });
  }
}
