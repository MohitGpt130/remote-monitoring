import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  @Input() menuType;
  @Input() options = [
    {
      title: 'Profile',
      icon: 'person_outline',
      routerLink: '/me/profile'
    },
    {
      title: 'Mailbox',
      icon: 'mail_outline',
      routerLink: '/me/mailbox'
    },
    {
      title: 'Logout',
      icon: 'power_settings_new',
      routerLink: '/auth/logout'
    }
  ];
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

  constructor() { }

  ngOnInit(): void {
  }

}
