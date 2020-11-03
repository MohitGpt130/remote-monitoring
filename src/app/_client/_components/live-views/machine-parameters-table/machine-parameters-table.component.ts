import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-machine-parameters-table',
  templateUrl: './machine-parameters-table.component.html',
  styleUrls: ['./machine-parameters-table.component.scss'],
})
export class MachineParametersTableComponent
  implements OnInit, AfterViewInit, OnChanges {
  tableData = [];
  @Input() displayedColumns;
  @Input() machines;
  @Input() tableParameters;
  @Input() statusColors;
  @Input() machinesStatus;
  @Input() tableDataAsObject;
  @Input() machineWiseFaultsTableData;
  @Input() machineWiseFaults;
  @Input() faultDescritions;

  filteredTableData;
  machineWiseSortedKeys = {
    count: {},
    duration: {},
  };

  topFirstFaults = {
    count: {},
    duration: {},
  };

  selectedButton = Math.round(Math.random() * 1) === 0 ? 'count' : 'duration';
  machineMode = ['Production Mode', 'Draining Mode', 'Dry Cycle Mode'];

  alarmsShuffling = {};
  alarmsShufflingTimer = {};

  constructor(private router: Router) {
    this.selectedButton = this.router.url.split('/')[3];
  }

  ngOnInit() {
    console.log('-----------Line 44-----------Machines', this.machines);
    if (this.selectedButton === 'count') this.showCount();
    else if (this.selectedButton === 'duration') this.showDuration();
  }

  ngAfterViewInit() {}

  ngOnChanges() {
    console.log(this.tableDataAsObject);
    if (this.tableDataAsObject.current_active_alarms !== undefined)
      for (let i = 0; i < Object.keys(this.machines).length; i++) {
        clearInterval(this.alarmsShufflingTimer[Object.keys(this.machines)[i]]);
        this.alarmsShufflingTimer[Object.keys(this.machines)[i]] = setInterval(
          () => {
            this.alarmsShuffling[Object.keys(this.machines)[i]] = parseInt(
              (
                Math.random() *
                this.tableDataAsObject.current_active_alarms[
                  Object.keys(this.machines)[i]
                ].length
              ).toString()
            );
          },
          500
        );
      }

    if (this.selectedButton === 'count') this.showCount();
    else if (this.selectedButton === 'duration') this.showDuration();
  }

  showDuration() {
    for (let j = 0; j < Object.keys(this.machineWiseFaults).length; j++) {
      this.machineWiseSortedKeys.duration[
        Object.keys(this.machineWiseFaults)[j]
      ] = this.machineWiseFaults[Object.keys(this.machineWiseFaults)[j]].sort(
        (a, b) => {
          return b.duration - a.duration;
        }
      );
    }
    console.log('Line nUmber : 74 - Machineparamerer table', this.machines);
    for (let i = 0; i < Object.keys(this.machines).length; i++) {
      if (
        this.machineWiseSortedKeys['duration'][
          Object.keys(this.machines)[i]
        ] !== undefined
      ) {
        for (
          let j = 0;
          j <
          this.machineWiseSortedKeys['duration'][Object.keys(this.machines)[i]]
            .length;
          j++
        ) {
          if (
            this.topFirstFaults['duration']['top_first_fault_' + (j + 1)] ===
            undefined
          )
            this.topFirstFaults['duration']['top_first_fault_' + (j + 1)] = {};
          this.topFirstFaults['duration']['top_first_fault_' + (j + 1)][
            Object.keys(this.machines)[i]
          ] = this.machineWiseSortedKeys['duration'][
            Object.keys(this.machines)[i]
          ][j];
        }

        for (
          let j = this.machineWiseSortedKeys['duration'][
            Object.keys(this.machines)[i]
          ].length;
          j < 5;
          j++
        ) {
          if (
            this.topFirstFaults['duration']['top_first_fault_' + (j + 1)] ===
            undefined
          )
            this.topFirstFaults['duration']['top_first_fault_' + (j + 1)] = {};
          this.topFirstFaults['duration']['top_first_fault_' + (j + 1)][
            Object.keys(this.machines)[i]
          ] = {};
        }
      }
      // console.log(this.topFirstFaults);
      // for(let j=0;j<Object.keys(this.topFirstFaults.duration).length;j++){
      //   this.tableDataAsObject[Object.keys(this.topFirstFaults.duration)[j]] = this.topFirstFaults.duration[Object.keys(this.topFirstFaults.duration)[j]];
      // }
    }

    // this.machineWiseFaultsTableData['manual_stops'] = machineWiseManualStops;
    this.machineWiseFaultsTableData['faults'] = this.topFirstFaults;

    if (this.machineWiseFaultsTableData.faults !== undefined) {
      for (
        let i = 0;
        i < Object.keys(this.machineWiseFaultsTableData.faults.duration).length;
        i++
      )
        this.tableDataAsObject[
          Object.keys(this.machineWiseFaultsTableData.faults.duration)[i]
        ] = this.machineWiseFaultsTableData.faults.duration[
          Object.keys(this.machineWiseFaultsTableData.faults.duration)[i]
        ];

      if (this.machineWiseFaultsTableData.manual_stops !== undefined)
        this.tableDataAsObject[
          'manual_stop'
        ] = this.machineWiseFaultsTableData.manual_stops['duration'];

      this.filterMachineParameters();
      this.selectedButton = 'duration';
    }
  }

  showCount() {
    for (let j = 0; j < Object.keys(this.machineWiseFaults).length; j++) {
      this.machineWiseSortedKeys.count[
        Object.keys(this.machineWiseFaults)[j]
      ] = this.machineWiseFaults[Object.keys(this.machineWiseFaults)[j]].sort(
        (a, b) => {
          return b.count - a.count;
        }
      );
    }

    for (let i = 0; i < Object.keys(this.machines).length; i++) {
      if (
        this.machineWiseSortedKeys['count'][Object.keys(this.machines)[i]] !==
        undefined
      ) {
        for (
          let j = 0;
          j <
          this.machineWiseSortedKeys['count'][Object.keys(this.machines)[i]]
            .length;
          j++
        ) {
          if (
            this.topFirstFaults['count']['top_first_fault_' + (j + 1)] ===
            undefined
          )
            this.topFirstFaults['count']['top_first_fault_' + (j + 1)] = {};
          this.topFirstFaults['count']['top_first_fault_' + (j + 1)][
            Object.keys(this.machines)[i]
          ] = this.machineWiseSortedKeys['count'][
            Object.keys(this.machines)[i]
          ][j];
        }

        for (
          let j = this.machineWiseSortedKeys['count'][
            Object.keys(this.machines)[i]
          ].length;
          j < 5;
          j++
        ) {
          if (
            this.topFirstFaults['count']['top_first_fault_' + (j + 1)] ===
            undefined
          )
            this.topFirstFaults['count']['top_first_fault_' + (j + 1)] = {};
          this.topFirstFaults['count']['top_first_fault_' + (j + 1)][
            Object.keys(this.machines)[i]
          ] = {};
        }
      }
      // for(let j=0;j<Object.keys(this.topFirstFaults.count).length;j++){
      //   this.tableDataAsObject[Object.keys(this.topFirstFaults.count)[j]] = this.topFirstFaults.count[Object.keys(this.topFirstFaults.count)[j]];
      // }
    }

    // this.machineWiseFaultsTableData['manual_stops'] = machineWiseManualStops;
    this.machineWiseFaultsTableData['faults'] = this.topFirstFaults;

    if (this.machineWiseFaultsTableData.faults !== undefined) {
      for (
        let i = 0;
        i < Object.keys(this.machineWiseFaultsTableData.faults.count).length;
        i++
      )
        this.tableDataAsObject[
          Object.keys(this.machineWiseFaultsTableData.faults.count)[i]
        ] = this.machineWiseFaultsTableData.faults.count[
          Object.keys(this.machineWiseFaultsTableData.faults.count)[i]
        ];

      if (this.machineWiseFaultsTableData.manual_stops !== undefined)
        this.tableDataAsObject[
          'manual_stop'
        ] = this.machineWiseFaultsTableData.manual_stops['count'];
      this.filterMachineParameters();
      this.selectedButton = 'count';
    }
  }

  filterMachineParameters() {
    this.filteredTableData = {};

    for (let i = 0; i < Object.keys(this.tableParameters).length; i++)
      if (
        this.tableDataAsObject[Object.keys(this.tableParameters)[i]] !==
        undefined
      ) {
        this.filteredTableData[
          Object.keys(this.tableParameters)[i]
        ] = this.tableDataAsObject[Object.keys(this.tableParameters)[i]];
      }
    // else {
    //   console.log('not found'+ Object.keys(this.tableParameters)[i]);
    // }

    // console.log(this.filteredTableData)
    this.tableData = [];
    console.log(this.filteredTableData);
    for (let i = 0; i < Object.keys(this.filteredTableData).length; i++) {
      if (
        this.filteredTableData[Object.keys(this.filteredTableData)[i]] ===
        undefined
      )
        this.filteredTableData[Object.keys(this.filteredTableData)[i]] = {};
      this.filteredTableData[Object.keys(this.filteredTableData)[i]][
        'parameter_name'
      ] = Object.keys(this.filteredTableData)[i];
      this.tableData.push(
        this.filteredTableData[Object.keys(this.filteredTableData)[i]]
      );
    }
  }

  getDetail(a) {
    console.log(a);
  }
}
