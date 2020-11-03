import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavigationBarComponent implements OnInit, AfterViewInit {
  @Input() menuParentId;
  @Input() menuItems: Array<any>;

  public settings: any;
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;
  constructor(
    public router: Router
  ) {
  }

  ngOnInit(): void {
    this.menuItems = this.menuItems.filter(
      (item) => item.parentId == this.menuParentId
    );
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.settings.fixedHeader) {
          let mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.scrollTop = 0;
          }
        } else {
          document.getElementsByClassName(
            'mat-drawer-content'
          )[0].scrollTop = 0;
        }
      }
    });
  }
}
