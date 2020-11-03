import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { timeout } from 'rxjs/operators';

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Component({
  selector: 'app-event-causes-data-table',
  templateUrl: './event-causes-data-table.component.html',
  styleUrls: ['./event-causes-data-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventCausesDataTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  @Input() data: any;
  @Input() config;
  @Input() lineID;
  @Output() refreshData: EventEmitter<any> = new EventEmitter<any>();

  timeout;

  @Output() onUpdateFaultCause = new EventEmitter<any>();

  faultCauses;
  dataLoaded = false;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    // this.httpClient.get('https://config-api.smartfactoryworx.net/services/ajay/fake-api/test2').subscribe(data => {
    //   this.displayedColumns = Object.keys(data[0]);
    //   this.dataSource = data;
    // });

    // this.getData();
    this.getFaultCauses(this.config);
  }

  updateFaultCause(event, element): void {
    // machine_name: "cam_blister"
    // parts: FormControl {validator: null, asyncValidator: null, pristine: true, touched: false, _onCollectionChange: ƒ, …}
    // selected_causes: Array(1)
    // 0: "5f351e3197788771eeb8587f"
    // length: 1
    // __proto__: Array(0)
    // stop_id: "5f367152213e2c114a207c0b"
    // user_comment: "s"
    // user_name: "ss"
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      console.log('updated');
      console.log(event, element);
      const postData = {
        stop_id: element._id,
        machine_name: element.machineName,
        selected_causes: [event.value],
        user_comment: '',
        user_name: 'default',
      };

      this.httpClient
        .post(this.config.updateOn, postData)
        .subscribe((resData) => {
          console.log(resData);
          this.refreshData.emit('xyz');
        });

      this.onUpdateFaultCause.emit({ element, event });
    }, this.config.updateAfter * 1000);
  }

  getData(api): void {
    this.httpClient.get(this.config.api.url).subscribe((data) => {
      this.data = data;
      this.httpClient
        .get(this.config.header.columns.stopCause.control.list)
        .subscribe((faultCauses) => {
          console.log(faultCauses);
          this.faultCauses = faultCauses;
          this.dataLoaded = true;
        });
    });
  }

  getFaultCauses(config): void {
    this.httpClient
      .get(config.header.columns.stopCause.control.list)
      .subscribe((faultCauses) => {
        this.faultCauses = faultCauses;
        this.dataLoaded = true;
      });
  }
}
