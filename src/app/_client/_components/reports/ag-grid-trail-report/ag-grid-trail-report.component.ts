import { ManualEntryService } from './../../manual-entry.service';

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import 'ag-grid-enterprise';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ag-grid-trail-report',
  templateUrl: './ag-grid-trail-report.component.html',
  styleUrls: ['./ag-grid-trail-report.component.scss']
})

export class AgGridTrailReportComponent {
  title = 'app';
  public gridApi;
  public gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public popupParent;
  public processChartOptions;
  public rowData: [];
  public autoGroupColumnDef;
  public rowGroupPanelShow;
  //------------------------------------------------------------------------------

  filtersForm: FormGroup;
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
  //------------------------------------------------------------------------------------

  //rowData: any[];
  constructor(public http: HttpClient, public dataSourceService: ManualEntryService, public datePipe: DatePipe) {

    this.columnDefs = [

      { headerName: 'Machine Name', field: 'machine_name', sortable: true, filter: true, enableRowGroup: true, chartDataType: 'machine_name' },
      { headerName: 'Stop Name', field: 'stop_name', sortable: true, filter: true, enableRowGroup: true },
      { headerName: 'Shift', field: 'shift', sortable: true, filter: true, enableRowGroup: true },
      { headerName: 'Operator Name', field: 'operator', sortable: true, filter: true, enableRowGroup: true },
      { headerName: 'Fault Name', field: 'fault_name', sortable: true, filter: true, enableRowGroup: true },
      { headerName: 'Start Time', field: 'start_time', sortable: true, filter: true },
      { headerName: 'End Time', field: 'end_time', sortable: true, filter: true },
      { headerName: 'Duration', field: 'duration', type: Number, sortable: true, filter: true, chartDataType: 'duration' }
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      resizable: true,
    };
    this.autoGroupColumnDef = { minWidth: 200 };
    this.rowGroupPanelShow = 'always';

    //--------------------------------------------------------------------------------------------------------------

    this.defaultColDef = {
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
    };

    this.popupParent = document.body;
    this.processChartOptions = function (params) {
      var opts = params.options;
      opts.title.enabled = true;
      opts.title.text = 'Grouping';
      opts.legend.position = 'bottom';
      opts.seriesDefaults.tooltip.renderer = function (params) {
        var titleStyle = params.color
          ? ' style="color: white; background-color:' + params.color + '"'
          : '';
        var title = params.title
          ? '<div class="ag-chart-tooltip-title"' +
          titleStyle +
          '>' +
          params.title +
          '</div>'
          : '';
        var value = params.datum[params.yKey]
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        return (
          title +
          '<div class="ag-chart-tooltip-content" style="text-align: center">' +
          value +
          '</div>'
        );
      };
      if (opts.xAxis) {
        opts.xAxis.label.rotation = 0;
      }
      if (opts.yAxis) {
        opts.yAxis.label.rotation = 0;
      }
      return opts;
    };
  }

  onFirstDataRendered(params) {
    var createRangeChartParams = {
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 10000,
        columns: ['operator', 'shift', 'duration'],
      },
      chartType: 'stackedColumn',
      chartContainer: document.querySelector('#myChart'),
      aggFunc: 'sum',
    };
    params.api.createRangeChart(createRangeChartParams);
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  //this.http.get('http://13.233.134.82:3000/api/trend/shifthistory?date=2020-04-14&shift=Shift%20A&type=machine&line_id=5e54a412ddf58e3866836970').subscribe((res: any) => {
    this.http.get('https://config-api.smartfactoryworx.net/services/ajay/fake-api/test1').subscribe((res: any) => {
      this.rowData = res;
    });
  }

  ngOnInit() {
    this.createFormFilters();
    this.createFiltersForm();
    this.GetShift_StateData();
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

  SearchStateData() {
    this.BindStatedetailsInTable(this.shift.value, this.date.value, this.stateid.value);
  }

  BindStatedetailsInTable(Shift, ShiftDate, State) {
    this.rowData = [];
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
            this.rowData = data;
          },
        );
      }
    });
  }
}
