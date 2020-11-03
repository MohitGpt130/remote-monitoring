import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-digital-watch',
  templateUrl: './digital-watch.component.html',
  styleUrls: ['./digital-watch.component.scss'],
})
export class DigitalWatchComponent implements OnInit {
  @Input() format = 'h:mm:ss a';
  now = new Date();

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }
}
