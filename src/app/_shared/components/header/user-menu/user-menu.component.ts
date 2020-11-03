import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  @Input() user;
  @Input() userMenuList: Array<any>;

  public userImage = '../assets/images/users/user.jpg';
  constructor() { }

  ngOnInit(): void {
  }

}
