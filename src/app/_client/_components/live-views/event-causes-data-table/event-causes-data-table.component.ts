import { StopInputFormComponent } from './../machine-parameters-charts/stop-input-form/stop-input-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { timeout } from 'rxjs/operators';

const ELEMENT_DATA: any[] = [
];

@Component({
  selector: 'app-event-causes-data-table',
  templateUrl: './event-causes-data-table.component.html',
  styleUrls: ['./event-causes-data-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventCausesDataTableComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  @Input() data: any;
  @Input() config;
  @Input() lineID;
  @Output() refreshData: EventEmitter<any> = new EventEmitter<any>();

  dataSource = new MatTableDataSource(this.data);
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  timeout;

  @Output() onUpdateFaultCause = new EventEmitter<any>();

  faultCauses = [];
  dataLoaded = false;

  constructor(
    private httpClient: HttpClient,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource(this.data);
    // this.dataSource.sort = this.sort;
    // // this.httpClient.get('https://config-api.smartfactoryworx.net/services/ajay/fake-api/test2').subscribe(data => {
    // //   this.displayedColumns = Object.keys(data[0]);
    // //   this.dataSource = data;
    // // });

    // // this.getData();
    // this.getFaultCauses(this.config);
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
        console.log(this.config.updateOn);

      this.onUpdateFaultCause.emit({ element, event });
    }, this.config.updateAfter * 1000);
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.getFaultCauses(this.config);

    const sortState: Sort = {active: 'name', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.dataSource.sort = this.sort;
  }

  // getData(api): void {
  //   this.httpClient.get(this.config.api.url).subscribe((data) => {
  //     this.data = data;
  //     this.config.header.columns.stopCause.control.list.forEach(ec => {
  //       console.log(ec);
  //       this.httpClient
  //       .get(ec)
  //       .subscribe((faultCauses: any[]) => {
  //         console.log(faultCauses);
  //         this.faultCauses = [...this.faultCauses, ...faultCauses];
  //         this.dataLoaded = true;
  //       });
  //     });
  //   });
  // }

  getFaultCauses(config): void {
    this.faultCauses = [];
    config.header.columns.stopCause.control.list.forEach(ec => {
      console.log(ec);
      this.httpClient
      .get(ec)
      .subscribe((faultCauses: any[]) => {
        console.log(faultCauses);
        this.faultCauses = [...this.faultCauses, ...faultCauses];
        console.log(this.faultCauses);
        this.dataLoaded = true;
      });
    });
    console.log(this.faultCauses);
  }

  // getForm(id, machineName, stopData, machineState) {
  //   const dialogRef = this.dialog.open(StopInputFormComponent, {
  //     width: '600px',
  //     height: '700px',
  //     data: {
  //       dataKey: {
  //         id,
  //         machine: machineName,
  //         data: stopData,
  //         machineState,
  //       },
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  getForm(id, machineName, stopData, machineState) {
    const dataKey = {
      id,
      machine: machineName,
      data: {
        message: 'select',
        row: 24,
        column: null,
        selectedRowValues: [
          'NMX Blister Machine, GS area, Line 12',
          id+ '/' + machineState + '/' + machineName,
          '#FFA500',
          stopData.from,
          stopData.to,
          '',
        ],
        selectedRowFormattedValues: [
          'NMX Blister Machine, GS area, Line 12',
          id+ '/' + machineState + '/' + machineName,
          '#FFA500',
          stopData.from,
          stopData.to,
          '',
        ],
        columnLabel: '',
      },
      machineState,
    };

    console.log(dataKey);
    // 5f3bc05f4fcce314c00f0d6b cam_blister
    // manual_stop

    const dialogRef = this.dialog.open(StopInputFormComponent, {
      width: '600px',
      height: '700px',
      data: {
        dataKey
      },
    });

    console.log(dataKey);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
