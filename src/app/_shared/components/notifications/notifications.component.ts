import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationsComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  public selectedTab = 1;
  @Input() messages: Array<any>;
  constructor() {}

  ngOnInit(): void {}

  openMessagesMenu(): void {
    this.trigger.openMenu();
    this.selectedTab = 0;
  }

  onMouseLeave(): void {
    this.trigger.closeMenu();
  }

  stopClickPropagate(event: any): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
