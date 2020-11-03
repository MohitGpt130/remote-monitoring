import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { MenuService } from '../menu/menu.service';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class SidenavComponent implements OnInit {
  currentUser;

  @Input() hideLogo = false;
  @Input() hideUserInfo = false;

  public userImage= '../assets/images/users/user.jpg';
  public menuItems: Array<any>;
  public settings: any;
  constructor(public appSettings: AppSettings, public menuService: MenuService, private authService: AuthService, private activatedRoute: ActivatedRoute){
      this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if(this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue.user;
    }
    // this.menuItems = this.menuService.getVerticalMenuItems();
    this.menuService.getMenuItems().subscribe(menuItems => {
      this.menuItems = menuItems;
    });

  }

  public closeSubMenus(){
    let menu = document.getElementById("vertical-menu");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');
          }
        }
      }
    }
  }
}
