import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  currentUser;

  public userImage = '../assets/images/users/user.jpg';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    if(this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue.user;
    }
  }

}
