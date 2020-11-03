import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Screen1Service } from '../screen1.service';

@Component({
  selector: 'app-fault-list',
  templateUrl: './fault-list.component.html',
  styleUrls: ['./fault-list.component.scss']
})
export class FaultListComponent {
  @Input() screenConfigs;
  @Input() isLoaded;
  @Input() faultList;
  @Input() dataSource;

  // statusColors;
  // isDataTableLoaded = false;
  displayedColumns: string[] = ['machineName', 'fault', 'isActive', 'startTime', 'timer', 'stopTime', 'duration'];
  notDisplayColumns = ['isActive'];

  // constructor(private screen1Service: Screen1Service, private httpClient: HttpClient) { }

  // ngOnInit(): any {
  //   setInterval(() => {this.screen1Service.screen1FaultData().subscribe((res: any) => {this.dataSource = res.data; this.statusColors = res.statusColors; this.isDataTableLoaded = true; },
  //   () => {this.httpClient.get('src\samples\avod-tv-screen1.json').subscribe((res: any) => {this.dataSource = res.data; this.statusColors = res.statusColors; this.isDataTableLoaded = true; });
  // })}, 3000);
  //   this.screen1Service.screen1FaultData().subscribe(data => this.dataSource = data);
  // }

  addSpace(item: string) {
    return item.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
