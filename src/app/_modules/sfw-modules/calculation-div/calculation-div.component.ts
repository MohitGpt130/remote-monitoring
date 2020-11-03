import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calculation-div',
  templateUrl: './calculation-div.component.html',
  styleUrls: ['./calculation-div.component.scss']
})
export class CalculationDivComponent implements OnInit {
  @Input() computedTableData;
  @Input() element;
  @Input() displayedColumn;

  constructor() { }

  ngOnInit(): void {
  }

}
