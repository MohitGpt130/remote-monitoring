import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ViewChildren,
  QueryList,
  Input,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AfterViewInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ScreenfullService } from '@ngx-extensions/screenfull';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sfw-layout',
  templateUrl: './sfw-layout.component.html',
  styleUrls: ['./sfw-layout.component.scss']
})
export class SfwLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild('backToTop', { static: true }) backToTop: any;
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;

  @Input() fixedHeader = true;
  @Input() theme = 'indigo-light';
  @Input() sidenavIsOpened = false;
  @Input() sidenavIsPinned = true;
  @Input() sidenavUserBlock;
  @Input() rtl = false;
  @Input() menu = 'vertical';
  @Input() menuType = 'default';
  @Input() menuItems: Array<any>;

  public menus = ['vertical', 'horizontal'];
  public menuOption: string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption: string;
  public lastScrollTop = 0;
  public showBackToTop = false;
  public toggleSearchBar = false;
  private defaultMenu: string;

  readonly mode$: Observable<string>;

  constructor(
    public router: Router,
    public readonly screenfullService: ScreenfullService,
    private location: Location
  ) {
    this.mode$ = this.screenfullService.fullScreenActive$.pipe(
      map((active) => (active ? 'active' : 'inactive'))
    );
  }

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.menu = 'vertical';
      this.sidenavIsOpened = false;
      this.sidenavIsPinned = false;
    }
    this.menuOption = this.menu;
    this.menuTypeOption = this.menuType;
    this.defaultMenu = this.menu;
  }

  ngAfterViewInit(): void {
    if (this.backToTop) {
      this.backToTop.nativeElement.style.display = 'none';
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this.sidenavIsPinned) {
          this.sidenav.close();
        }
        if (window.innerWidth <= 768) {
          this.sidenav.close();
        }
      }
    });
    if (this.menu === 'vertical') {
      // this.expandActiveSubMenu(this.menuItems);
    }
  }

  public chooseMenu(): void {
    this.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(['/']);
  }

  public chooseMenuType(): void {
    this.menuType = this.menuTypeOption;
  }

  public changeTheme(theme): void {
    this.theme = theme;
  }

  public toggleSidenav(): void {
    this.sidenav.toggle();
  }

  public onPsScrollY(event): void {
    if (this.backToTop) {
      event.target.scrollTop > 300
        ? (this.backToTop.nativeElement.style.display = 'flex')
        : (this.backToTop.nativeElement.style.display = 'none');
    }

    if (this.menu == 'horizontal') {
      if (this.fixedHeader) {
        const currentScrollTop =
          event.target.scrollTop > 56 ? event.target.scrollTop : 0;
        if (currentScrollTop > this.lastScrollTop) {
          document.querySelector('#horizontal-menu').classList.add('sticky');
          event.target.classList.add('horizontal-menu-hidden');
        } else {
          document.querySelector('#horizontal-menu').classList.remove('sticky');
          event.target.classList.remove('horizontal-menu-hidden');
        }
        this.lastScrollTop = currentScrollTop;
      } else {
        if (event.target.scrollTop > 56) {
          document.querySelector('#horizontal-menu').classList.add('sticky');
          event.target.classList.add('horizontal-menu-hidden');
        } else {
          document.querySelector('#horizontal-menu').classList.remove('sticky');
          event.target.classList.remove('horizontal-menu-hidden');
        }
      }
    }
  }

  public scrollToTop(): void {
    this.pss.forEach((ps) => {
      if (
        ps.elementRef.nativeElement.id === 'main' ||
        ps.elementRef.nativeElement.id === 'main-content'
      ) {
        ps.scrollToTop(0, 250);
      }
    });
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.sidenavIsOpened = false;
      this.sidenavIsPinned = false;
      this.menu = 'vertical';
    } else {
      this.defaultMenu == 'horizontal'
        ? (this.menu = 'horizontal')
        : (this.menu = 'vertical');
      this.sidenavIsOpened = true;
      this.sidenavIsPinned = true;
    }
  }

  public closeSubMenus(): void {
    const menu = document.querySelector('.sidenav-menu-outer');
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        const child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

  public expandActiveSubMenu(menu: Array<any>): void {
    const url = this.location.path();
    const routerLink = url; // url.substring(1, url.length);
    const activeMenuItem = menu.filter(
      (item) => item.routerLink === routerLink
    );
    if (activeMenuItem[0]) {
      let menuItem = activeMenuItem[0];
      while (menuItem.parentId !== 0) {
        const parentMenuItem = menu.filter(
          (item) => item.id === menuItem.parentId
        )[0];
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  public toggleMenuItem(menuId): void {
    const menuItem = document.getElementById('menu-item-' + menuId);
    const subMenu = document.getElementById('sub-menu-' + menuId);
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
}
