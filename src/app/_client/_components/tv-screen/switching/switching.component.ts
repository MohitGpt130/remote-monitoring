import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Screen2Service } from '../screen2/screen2.service';

@Component({
  selector: 'app-switching',
  templateUrl: './switching.component.html',
  styleUrls: ['./switching.component.scss']
})
export class SwitchingComponent implements OnInit {
  isToSwitchOnFault = false;
  config;
  name = 'Set iframe source';
  url: string = "https://angular.io/api/router/RouterLink";
  urlSafe: SafeResourceUrl;
  onFaultUrlSafe: SafeResourceUrl;
  defaultUrlSafe: SafeResourceUrl;


  isLoaded = false;
  data;
  liveFaults;
  screenConfigs;

  constructor(
    private httpClient: HttpClient,
    private screen2Service: Screen2Service,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.screen2Service.getScreenConfigs().subscribe(c => {
      this.screenConfigs = c;
      if (this.screenConfigs && this.data) {
        this.isLoaded = true;
      }
    });

    this.getScreenConfigs().subscribe(d => {
      this.config = d;
      this.onFaultUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.config.defaultUrl);
      this.defaultUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.config.onFaultUrl);
    });
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    setInterval(() => {
      this.screen2Service.getScreen2Data().subscribe(d => {
        this.data = d;
        let isToSwitchOnFault = false;
        for (const machine in this.data.machineStatus) {
          const element = this.data.machineStatus[machine];
          if(element.status === 'stop') {
            isToSwitchOnFault = true;
          }
        }
        if(isToSwitchOnFault !== this.isToSwitchOnFault) {
          this.isToSwitchOnFault = isToSwitchOnFault;
        }
        this.liveFaults = d.liveFaults;
        if (this.screenConfigs && this.data) {
          this.isLoaded = true;
        }
      });
    }, 5000);

  }

  getScreenConfigs(): Observable<any> {
    return this.httpClient.get<any>('/tv-screen/configs/apix/switching-urls.config.json');
  }
}
