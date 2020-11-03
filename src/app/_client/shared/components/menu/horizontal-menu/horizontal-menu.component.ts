import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppSettings } from '../../../../app.settings';
import { MenuService } from '../menu.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService],
})
export class HorizontalMenuComponent implements OnInit, AfterViewInit {
  @Input('menuParentId') menuParentId;
  public menuItems: Array<any>;
  public settings: any;
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;
  constructor(
    public appSettings: AppSettings,
    public menuService: MenuService,
    public router: Router
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    // this.menuItems = this.menuService.getHorizontalMenuItems();
    this.menuService.getMenuItems().subscribe(menuItems => {
      this.menuItems = menuItems;
      this.menuItems = this.menuItems.filter(
        (item) => item.parentId == this.menuParentId
      );
    });
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
