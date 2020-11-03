import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pipe-div',
  templateUrl: './pipe-div.component.html',
  styleUrls: ['./pipe-div.component.scss']
})
export class PipeDivComponent implements OnInit {
  @Input() computedTableData;
  @Input() element;
  @Input() displayedColumn;

  constructor() { }

  ngOnInit(): void {
  }

}
