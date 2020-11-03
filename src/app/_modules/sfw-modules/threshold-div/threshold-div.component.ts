import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-threshold-div',
  templateUrl: './threshold-div.component.html',
  styleUrls: ['./threshold-div.component.scss']
})
export class ThresholdDivComponent implements OnInit {
  @Input() computedTableData;
  @Input() element;
  @Input() displayedColumn;

  threshHoldMatchCounter = {};

  constructor() { }

  ngOnInit(): void {
  }

  increaseThreshHoldCounter(parameterName, column): void {
    if (!this.threshHoldMatchCounter[parameterName]) {
      this.threshHoldMatchCounter[parameterName] = {};
      this.threshHoldMatchCounter[parameterName][column] = 1;
    } else if (this.threshHoldMatchCounter[parameterName] && !this.threshHoldMatchCounter[parameterName][column]){
      this.threshHoldMatchCounter[parameterName][column] = 1;
    } else {
      this.threshHoldMatchCounter[parameterName][column]++;
    }
  }

}
