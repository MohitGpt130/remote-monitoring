import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { MenuService } from '../../components/menu/menu.service';
import { AppSettings } from '../../../app.settings';
import { AfterViewInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ScreenfullService } from '@ngx-extensions/screenfull';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tv-screen-layout',
  templateUrl: './tv-screen-layout.component.html',
  styleUrls: ['./tv-screen-layout.component.scss'],
  providers: [MenuService],
})
export class TvScreenLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild('backToTop', { static: true }) backToTop: any;
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  public settings: any;
  public menus = ['vertical', 'horizontal'];
  public menuOption: string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption: string;
  public lastScrollTop = 0;
  public showBackToTop = false;
  public toggleSearchBar = false;
  private defaultMenu: string;

  public menuItems: Array<any>;

  readonly mode$: Observable<string>;

  constructor(
    public appSettings: AppSettings,
    public router: Router,
    private menuService: MenuService,
    public readonly screenfullService: ScreenfullService,
  ) {
    this.mode$ = this.screenfullService.fullScreenActive$.pipe(
      map(active => (active ? 'active' : 'inactive'))
     );
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu;
    this.menuTypeOption = this.settings.menuType;
    this.defaultMenu = this.settings.menu;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.settings.loadingSpinner = false;
    }, 300);
    this.backToTop.nativeElement.style.display = 'none';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this.settings.sidenavIsPinned) {
          this.sidenav.close();
        }
        if (window.innerWidth <= 768) {
          this.sidenav.close();
        }
      }
    });
    if (this.settings.menu === 'vertical') {
      // this.menuService.expandActiveSubMenu(
      //   this.menuService.getVerticalMenuItems()
      // );
      this.menuService.getMenuItems().subscribe(menuItems => {
        this.menuItems = menuItems;
        this.menuService.expandActiveSubMenu(
          this.menuItems
        );
      });
    }
  }

  public chooseMenu(): void {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(['/']);
  }

  public chooseMenuType(): void {
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme): void {
    this.settings.theme = theme;
  }

  public toggleSidenav(): void {
    this.sidenav.toggle();
  }

  public onPsScrollY(event): void {
    event.target.scrollTop > 300
      ? (this.backToTop.nativeElement.style.display = 'flex')
      : (this.backToTop.nativeElement.style.display = 'none');
    if (this.settings.menu == 'horizontal') {
      if (this.settings.fixedHeader) {
        var currentScrollTop = event.target.scrollTop > 56 ? event.target.scrollTop : 0;
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
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'vertical';
    } else {
      this.defaultMenu == 'horizontal'
        ? (this.settings.menu = 'horizontal')
        : (this.settings.menu = 'vertical');
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
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
}
