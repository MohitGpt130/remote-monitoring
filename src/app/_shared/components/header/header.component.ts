import { ScreenfullService } from '@ngx-extensions/screenfull';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() fixedHeader = true;
  @Input() theme = 'indigo-light';
  @Input() sidenavIsOpened = true;
  @Input() sidenavIsPinned = false;
  @Input() sidenavUserBlock;
  @Input() rtl = false;
  public toggleSearchBar = false;
  @Input() menuType = 'vertical';

  @Output() drawerOpen = new EventEmitter();

  readonly mode$: Observable<string>;

  constructor(public readonly screenfullService: ScreenfullService) {
    this.mode$ = this.screenfullService.fullScreenActive$.pipe(
      map((active) => (active ? 'active' : 'inactive'))
    );
  }

  ngOnInit(): void {}

  public toggleSidenav(): void {
    this.drawerOpen.emit(this.sidenavIsOpened != this.sidenavIsOpened)
    // this.sidenav.toggle();
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
