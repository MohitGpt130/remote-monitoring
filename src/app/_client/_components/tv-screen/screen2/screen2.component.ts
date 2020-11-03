import { Component, OnInit, Input } from '@angular/core';
import { Screen2Service } from './screen2.service';

@Component({
  selector: 'app-screen2',
  templateUrl: './screen2.component.html',
  styleUrls: ['./screen2.component.scss']
})
export class Screen2Component implements OnInit {
  isLoaded = false;
  data;
  liveFaults;
  screenConfigs;
  constructor(private screen2Service: Screen2Service) { }

  ngOnInit(): void {
    this.screen2Service.getScreenConfigs().subscribe(c => {
      this.screenConfigs = c;
      if (this.screenConfigs && this.data) {
        this.isLoaded = true;
      }
    });
    this.screen2Service.getScreen2Data().subscribe(d => {
      this.data = d;
      this.liveFaults = d.liveFaults;
      if (this.screenConfigs && this.data) {
        this.isLoaded = true;
      }
    });

    setInterval(() => {
      this.screen2Service.getScreen2Data().subscribe(d => {
        this.data = d;
        this.liveFaults = d.liveFaults;
        if (this.screenConfigs && this.data) {
          this.isLoaded = true;
        }
      });
    }, 1000);
  }

}
