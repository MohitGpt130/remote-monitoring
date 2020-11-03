import { ClientService } from './../../../client.service';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { Menu } from './menu.model';
import { verticalMenuItems, horizontalMenuItems } from './menu';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class MenuService {
  menusObserver: Observer<any>;
  allRouteMenuItems;

  constructor(
    private location: Location,
    private router: Router,
    private httpClient: HttpClient,
    private appService: ClientService,
  ) {
    this.getMenuItems().subscribe();
  }

  public getVerticalMenuItems(): Array<Menu> {
    return verticalMenuItems;
  }

  public getHorizontalMenuItems(): Array<Menu> {
    return horizontalMenuItems;
  }

  public getMenuItems(): Observable<any> {
    if(this.allRouteMenuItems) {
      const topRoute = this.router.url.split('/')[this.appService.dashboardConfigs.menuRouteIndex];
      if(this.allRouteMenuItems[topRoute]) {

        this.menusObserver.next(this.allRouteMenuItems[topRoute].filter(m => m.isActive));
      } else {
        this.menusObserver.next(this.allRouteMenuItems['default'].filter(m => m.isActive));
      }
    } else {
      this.httpClient.get('configs/dashboard.config.json').subscribe((dashboardConfigs: any) => {
        this.allRouteMenuItems = dashboardConfigs.menuItems;
        const topRoute = this.router.url.split('/')[this.appService.dashboardConfigs.menuRouteIndex];
        if(this.allRouteMenuItems[topRoute]) {
          this.menusObserver.next(this.allRouteMenuItems[topRoute].filter(m => m.isActive));
        } else {
          this.menusObserver.next(this.allRouteMenuItems['default'].filter(m => m.isActive));
        }
      });
    }

    return new Observable((observer) => {
      this.menusObserver = observer;
    });
  }

  public expandActiveSubMenu(menu: Array<Menu>) {
    let url = this.location.path();
    let routerLink = url; // url.substring(1, url.length);
    let activeMenuItem = menu.filter((item) => item.routerLink === routerLink);
    if (activeMenuItem[0]) {
      let menuItem = activeMenuItem[0];
      while (menuItem.parentId != 0) {
        let parentMenuItem = menu.filter(
          (item) => item.id == menuItem.parentId
        )[0];
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  public toggleMenuItem(menuId) {
    let menuItem = document.getElementById('menu-item-' + menuId);
    let subMenu = document.getElementById('sub-menu-' + menuId);
    if (subMenu) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      } else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }
  }

  public closeOtherSubMenus(menu: Array<Menu>, menuId) {
    let currentMenuItem = menu.filter((item) => item.id == menuId)[0];
    if (currentMenuItem.parentId == 0 && !currentMenuItem.target) {
      menu.forEach((item) => {
        if (item.id != menuId) {
          let subMenu = document.getElementById('sub-menu-' + item.id);
          let menuItem = document.getElementById('menu-item-' + item.id);
          if (subMenu) {
            if (subMenu.classList.contains('show')) {
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }
          }
        }
      });
    }
  }
}
