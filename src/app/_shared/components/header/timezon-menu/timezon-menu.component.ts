import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-timezon-menu',
  templateUrl: './timezon-menu.component.html',
  styleUrls: ['./timezon-menu.component.scss']
})
export class TimezonMenuComponent implements OnInit {
  @Input() timeZoneList;

  constructor() { }

  ngOnInit(): void {
  }

}
