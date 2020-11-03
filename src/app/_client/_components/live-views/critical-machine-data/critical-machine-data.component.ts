import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-critical-machine-data',
  templateUrl: './critical-machine-data.component.html',
  styleUrls: ['./critical-machine-data.component.scss']
})
export class CriticalMachineDataComponent implements OnInit {

  @Input() criticalMachineData = [ { "title": "OEE", "value": "11.31%" }, { "title": "Bottles Produced", "value": 1068 }, { "title": "Availability", "value": "85.11%" }, { "title": "Bottles Rejected", "value": 2 }, { "title": "Performance", "value": "13.32%" }, { "title": "Bottles Lost", "value": 8356 }, { "title": "Quality", "value": "99.81%" }, { "title": "Time Lost", "value": "8:42:00" } ]
  @Input() criticalMachineParameters;
  @Input() colorStatus;
  @Input() statusColors;
  
  constructor() { }

  ngOnInit() {
  }

}
