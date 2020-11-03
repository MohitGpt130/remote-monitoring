import { Component, OnInit, Input } from '@angular/core';
import { Screen2Service } from '../screen2.service';

@Component({
  selector: 'app-plant-diagram',
  templateUrl: './plant-diagram.component.html',
  styleUrls: ['./plant-diagram.component.scss']
})
export class PlantDiagramComponent implements OnInit {
  @Input() screenConfigs;
  @Input() isLoaded;
  @Input() data;

  constructor(private screen2Service: Screen2Service) { }
  ngOnInit(): void {

  }

  formatLabel(value: number) {
    if (value >= 100) {
      return Math.round(value / 1) + 'k';
    }

    return value;
  }

}
