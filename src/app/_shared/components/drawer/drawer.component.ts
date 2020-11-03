import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DrawerComponent implements OnInit {
  currentUser;

  public userImage = '../assets/images/users/user.jpg';
  @Input() menuItems: Array<any>;
  @Input() menuType;
  @Input() sidenavIsPinned = false;
  @Input() sidenavUserBlock = true;
  @Input() user = {
    name: 'user',
    fullName: 'Default User',
    joined: new Date(),
    roles : [
      {
        name: 'default',
        title: 'Default Role'
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {
  }

  public closeSubMenus(): void {
    let menu = document.getElementById('vertical-menu');
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
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
