import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ClientService } from '../../client.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, AfterViewChecked {
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
