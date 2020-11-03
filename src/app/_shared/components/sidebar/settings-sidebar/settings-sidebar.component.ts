import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss']
})
export class SettingsSidebarComponent implements OnInit {
  @Input() fixedHeader = true;
  @Input() theme = 'indigo-light';
  @Input() sidenavIsOpened;
  @Input() sidenavUserBlock;
  @Input() sidenavIsPinned;
  @Input() rtl = false;
  @Input() menu = 'vertical';
  @Input() menuType = 'default';
  @Input() menuItems: Array<any>;

  public menus = ['vertical', 'horizontal'];
  public menuTypes = ['default', 'compact', 'mini'];
  public menuOption: string;
  public menuTypeOption: string;
  private defaultMenu: string;

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  public changeTheme(theme): void {
    this.theme = theme;
  }

  public chooseMenuType(): void {
    this.menuType = this.menuTypeOption;
  }

  public chooseMenu(): void {
    this.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(['/']);
  }

}
