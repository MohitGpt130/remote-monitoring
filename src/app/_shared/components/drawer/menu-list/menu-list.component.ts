import {
  Component,
  OnInit,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

export class Menu {
  constructor(
    public id: number,
    public title: string,
    public routerLink: string,
    public href: string,
    public icon: string,
    public target: string,
    public hasSubMenu: boolean,
    public parentId: number
  ) {}
}

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuListComponent implements OnInit, AfterViewInit {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  @Output() onClickMenuItem: EventEmitter<any> = new EventEmitter<any>();
  parentMenu: Array<any>;
  public settings: any;
  constructor(
    public router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.parentMenu = this.menuItems.filter(
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

  onClick(menuId) {
    this.toggleMenuItem(menuId);
    this.closeOtherSubMenus(this.menuItems, menuId);
    this.onClickMenuItem.emit(menuId);
  }

  public expandActiveSubMenu(menu: Array<Menu>): void {
    let url = this.location.path();
    let routerLink = url; // url.substring(1, url.length);
    console.log(menu);
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

  public toggleMenuItem(menuId): void {
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

  public closeOtherSubMenus(menu: Array<Menu>, menuId): void {
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
