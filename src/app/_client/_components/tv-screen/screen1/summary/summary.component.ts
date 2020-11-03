import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Screen1Service } from '../screen1.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() screenConfigs;
  @Input() isLoaded;
  @Input() summary;
  titles = ['OEE1', 'qualityRate', 'totalBreakDown', 'bestOEE1'];

  addSpace(item: string) {
    return item.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  
}
