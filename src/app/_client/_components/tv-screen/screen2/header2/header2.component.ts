import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.scss']
})
export class Header2Component implements OnInit {
  @Input() screenConfigs;
  @Input() isLoaded;
  @Input() data;

  constructor() { }

  ngOnInit(): void {
  }

}
