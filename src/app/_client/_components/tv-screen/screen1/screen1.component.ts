import { Component, OnInit } from '@angular/core';
import { Screen1Service } from './screen1.service';


@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.scss']
})
export class Screen1Component implements OnInit {
  isLoaded = false;
  data;
  screenConfigs;
  faultList

  constructor(private screen1Service: Screen1Service) { }

  ngOnInit(): void {
    this.screen1Service.getScreenConfigs().subscribe(c => {
      this.screenConfigs = c;
      if (this.screenConfigs && this.data) {
        this.isLoaded = true;
      }
    });

    setInterval(() => {
      this.screen1Service.screen1FaultData().subscribe(d => {
        this.data = d;
        this.faultList = d.faultList;
        if (this.screenConfigs && this.data) {
          this.isLoaded = true;
        }
      });
    }, 1000);

  }

}
