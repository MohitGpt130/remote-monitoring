import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scrolling-data-div',
  templateUrl: './scrolling-data-div.component.html',
  styleUrls: ['./scrolling-data-div.component.scss']
})
export class ScrollingDataDivComponent implements OnInit {
  @Input() computedTableData;
  @Input() element;
  @Input() displayedColumn;
  @Input() interval;

  counter = 1;
  bounce: any;

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      this.counter++;
    }, this.interval ? (this.interval * 1000) : 1000);
  }
}
