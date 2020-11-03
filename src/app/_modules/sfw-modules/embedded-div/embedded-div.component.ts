import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-embedded-div',
  templateUrl: './embedded-div.component.html',
  styleUrls: ['./embedded-div.component.scss']
})
export class EmbeddedDivComponent implements OnInit {
  @Input() computedTableData;
  @Input() element;
  @Input() displayedColumn;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(event): void {}

}
