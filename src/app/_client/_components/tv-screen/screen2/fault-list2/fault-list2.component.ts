import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Screen2Service } from '../screen2.service';

@Component({
  selector: 'app-fault-list2',
  templateUrl: './fault-list2.component.html',
  styleUrls: ['./fault-list2.component.scss']
})
export class FaultList2Component {
  @Input() screenConfigs;
  @Input() isLoaded;
  @Input() liveFaults;
  @Input() dataSource;

  statusColors;
  isDataTableLoaded = false;
  displayedColumns: string[] = ['machineName', 'fault', 'isActive', 'startTime', 'timer', 'stopTime', 'duration'];
  notDisplayColumns = ['isActive'];

  addSpace(item: string) {
    return item.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
