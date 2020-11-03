import { ManualEntryService } from './../../manual-entry.service';
import { MatTableDataSource } from '@angular/material/table';

import { Component, OnInit, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as XLSX from "xlsx";
export class Group {
  level = 0;
  parent: Group;
  expanded = false;
  totalCounts = 0;
  totalDuration = 0.0;
  totalMachinecount = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}
@Component({
  selector: 'app-faultreport1',
  templateUrl: './faultreport1.component.html',
  styleUrls: ['./faultreport1.component.scss']
})

export class Faultreport1Component implements OnInit {
  //Filters for the fault report
  tomorrow = new Date();
  filtersForm: FormGroup;
  //3 formcontrols used in page as below
  shift: FormControl;
  date: FormControl;
  stateid: FormControl;
  Shift = [];
  State = [];
  MaxGroupCount;
  MaxGroupDuration;
  createFormFilters() {
    this.shift = new FormControl('', Validators.required);
    this.date = new FormControl('', Validators.required);
    //this.machine_state = new FormControl('', Validators.required);
    this.stateid = new FormControl('');
  }
  createFiltersForm() {
    this.filtersForm = new FormGroup({
      shift: this.shift,
      date: this.date,
      stateid: this.stateid
    });
  }
  constructor(
    protected dataSourceService: ManualEntryService, public datePipe: DatePipe, private httpClient: HttpClient
  ) {
    this.columns = [
      { field: 'machine_name', display_name: 'Machine Name' },
      { field: 'start_time', display_name: 'Start ' },
      { field: 'end_time', display_name: 'End' },
      { field: 'duration', display_name: 'Duration' },
      { field: 'fault_name', display_name: 'Fault Name' },
      { field: 'fault_cause', display_name: 'Cause' },
      { field: 'usercomment1', display_name: 'User Comment-1' }];
    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['machine_name'];

  }

  ngOnInit() {
    this.createFormFilters();
    this.createFiltersForm();
    this.GetShift_StateData();
    this.BindStatedetailsInTable('', '', '');
  }

  BindStatedetailsInTable(Shift, ShiftDate, State) {
    if (Shift === "") {
      this.shift.setValue('Shift A');
      Shift = 'Shift A';
    }
    else {
      Shift = this.shift.value;
    }
    if (ShiftDate === "") {
      var Temp = new Date();
      ShiftDate = this.datePipe.transform(Temp.setDate(Temp.getDate() - 1), 'yyyy-MM-dd');
      this.date.setValue(ShiftDate);

    }
    else {
      ShiftDate = this.datePipe.transform(ShiftDate, 'yyyy-MM-dd')
    }
    if (State === "") {
      this.stateid.setValue('fault');
      State = 'fault';
    }
    this.dataSourceService.GetServerAPIPath().subscribe(apipath => {
      if (apipath['server'] !== undefined) {
        this.dataSourceService.GetStateCauseData(apipath['server'], Shift, ShiftDate, State).subscribe(
          (data: any) => {
            data.forEach((item, index) => {
              item.id = index + 1;
              item.start_time = this.datePipe.transform(this.dataSourceService.ConvertToLocalTimezone(item.start_time), 'yyyy-MM-dd HH:mm');
              item.end_time = this.datePipe.transform(this.dataSourceService.ConvertToLocalTimezone(item.end_time), 'yyyy-MM-dd HH:mm');
              item.usercomment1 = item.user_comment1.comment;
            });
            this._alldata = data;
            this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
            this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
            this.dataSource.filter = performance.now().toString();
          },
        );
      }
    });
  }

  GetShift_StateData() {
    //this.Shift = [];
    this.dataSourceService.GetServerAPIPath().subscribe(apipath => {
      if (apipath['server'] !== undefined) {
        this.dataSourceService.GetShiftDetails(apipath['server'], apipath['line_id']).subscribe(
          (shiftdata: any[]) => {
            for (let i = 0; i < shiftdata.length; i++) {
              const c = shiftdata[i];
              let a: string[] = [''];
              a.push(c._id);
              a.push(c.shift);
              this.Shift.push(a);
            }
          })

        this.dataSourceService.GetSubstituteData(apipath['line_id'], 'machinestate', apipath['server']).subscribe(
          (statedata: any[]) => {
            for (let i = 0; i < statedata.length; i++) {
              const c = statedata[i];
              let a: string[] = [''];
              a.push(c.value);
              a.push(c.display_name);
              this.State.push(a);
            }
          })
      }
    });
  }

  title = 'Grid Grouping';
  public dataSource = new MatTableDataSource<any | Group>([]);
  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];

  groupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  checkGroupByColumn(field, add) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupByColumns.push(field);
      }
    }
  }

  unGroupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, false);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!row[column] || !data[column] || row[column] !== data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();  // bug here need to fix
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        row => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);
    const currentColumn = groupByColumns[level];
    let subGroups = [];

    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = 'Total Duration : ' + rowsInGroup.filter(item => item.duration >= 0).reduce((sum, current) => (parseFloat(sum) + parseFloat(current.duration)).toFixed(2), 0) + ' Minutes' + ', Total Count:' + rowsInGroup.length;//rowsInGroup.length;
      //const sum = data.filter(item => item.duration !== undefined).reduce((sum, current) => sum + current.total, 0);
      group.totalDuration = rowsInGroup.filter(item => item.duration >= 0).reduce((sum, current) => (parseFloat(sum) + parseFloat(current.duration)).toFixed(2), 0);
      group.totalMachinecount = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    const maxDur = Math.max.apply(Math, groups.map(function (o) { return o.totalDuration; }))
    const maxCount = Math.max.apply(Math, groups.map(function (o) { return o.totalMachinecount; }))
    this.MaxGroupCount = groups.find(function (o) { return o.totalMachinecount == maxCount; });
    this.MaxGroupDuration = groups.find(function (o) { return o.totalDuration == maxDur; });

    //this.MaxGroupDuration =groups.find(function(o){ return o.totalDuration == max; });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  SearchStateData() {
    this.BindStatedetailsInTable(this.shift.value, this.date.value, this.stateid.value);
  }

  exportToExcel() {
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById('ExampleTable');
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
