import { Component, OnInit } from '@angular/core';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-trail-grid',
  templateUrl: './trail-grid.component.html',
  styleUrls: ['./trail-grid.component.scss']
})


export class TrailGridComponent implements OnInit {
  // displayedColumns = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;

ngOnInit()
{
  
}
  
}
