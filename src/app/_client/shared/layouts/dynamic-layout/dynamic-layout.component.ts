import { ClientService } from './../../../client.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-layout',
  templateUrl: './dynamic-layout.component.html',
  styleUrls: ['./dynamic-layout.component.scss']
})
export class DynamicLayoutComponent implements OnInit {
  layout;

  constructor(private route: ActivatedRoute, private appService: ClientService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.layout = params['layout']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      // if (this.appService.dashboardConfigs.defaultRoute && this.appService.dashboardConfigs.defaultRoute !== '' && this.layout !== this.appService.dashboardConfigs.defaultRoute) {
      //   this.router.navigate([this.appService.dashboardConfigs.defaultRoute]);
      // }
    });
    console.log(this.route.snapshot.root.data);
  }
}
