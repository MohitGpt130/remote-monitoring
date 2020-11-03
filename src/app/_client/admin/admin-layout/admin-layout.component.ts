import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ClientService } from '../../client.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, AfterViewChecked {
  isLoaded = false;

  constructor(
    private appService: ClientService,
  ) { }

  ngOnInit(): void {
    this.appService
    .getDashboardSettings()
    .then((data: any) => {
      this.isLoaded = true;
    });
  }

  ngAfterViewChecked(): void {
  }

}
