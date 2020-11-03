import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


interface Shift {
  shiftid: string,
  shiftname: string,
  shiftstarttime: string,
  shiftendtime: string
}

interface PDT {
  pdtid: string,
  pdtname: string,
  pdttype: string,
  shiftid?: string,
  shiftname?: string,
  lineid: string,
  starttime?: string,//This is date
  endtime?: string,//This is date
  pdtstarttime?: string,
  pdtendtime?: string,
  displaypdtstart: string,
  displaypdtend: string
}

interface type {
  checked: boolean,
  value: string,
  name: string
}

@Component({
  selector: 'app-plantdowntime',
  templateUrl: './plantdowntime.component.html',
  styleUrls: ['./plantdowntime.component.scss']
})
export class PlantdowntimeComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, public datepipe: DatePipe) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  //public Companies: Company[] = [];
  @Input() lineid: string;
  public Shifts: Shift[] = [];
  public PDT: PDT[] = [];
  selected: boolean = false;
  showshift: boolean = true;
  Temp;
  pdtform: FormGroup;
  gotData:boolean=false;

  _id: FormControl;
  shift: FormControl;
  pdt_type: FormControl;
  pdt_name: FormControl;
  pdt_start_time: FormControl;
  pdt_end_time: FormControl;
  start_time: FormControl;
  end_time: FormControl

  displayedColumns: string[];
  vdisplayedColumns: string[];
  typepdt: boolean = true;

  pdttypes: type[] = [
    { name: 'Planned', value: 'planned', checked: true },
    { name: 'UnPlanned', value: 'unplanned', checked: false }
  ]
  dataSource: MatTableDataSource<PDT>;

  //dataSource = [];
  displayedColumnsAs = {
    pdtid: { 'DN': 'PDT ID', 'visible': true },
    pdtname: { 'DN': 'PDT Name', 'visible': false },
    pdttype: { 'DN': 'PDT Type', 'visible': false },
    shiftid: { 'DN': 'Shift', 'visible': true },
    shiftname: { 'DN': 'Shift', 'visible': false },
    lineid: { 'DN': 'Line', 'visible': false },
    pdtstarttime: { 'DN': 'PDT Start', 'visible': true },
    pdtendtime: { 'DN': 'PDT End', 'visible': true },
    starttime: { 'DN': 'PDT Start', 'visible': true },
    endtime: { 'DN': 'PDT End', 'visible': true },
    displaypdtstart: { 'DN': 'PDT Start', 'visible': false },
    displaypdtend:{ 'DN': 'PDT End', 'visible': false }
  }
  HideColumnsAs: string[] = ['_id', '__v'];

  createFormControlsPDT() {
    this._id = new FormControl('');
    //this.company_id = new FormControl('', Validators.required);
    this.shift = new FormControl('');
    this.pdt_type = new FormControl('', Validators.required);
    this.pdt_name = new FormControl('', Validators.required);
    this.pdt_start_time = new FormControl('');
    this.pdt_end_time = new FormControl('');
    this.start_time = new FormControl('');
    this.end_time = new FormControl('');
  }

  createPDTForm() {
    this.pdtform = new FormGroup({
      _id: this._id,
      shift: this.shift,
      pdt_type: this.pdt_type,
      pdt_name: this.pdt_name,
      pdt_start_time: this.pdt_start_time,
      pdt_end_time: this.pdt_end_time,
      start_time: this.start_time,
      end_time: this.end_time
    });
  }

  GetShiftData(lineid) {
    this.Shifts = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/shift?line_id=' + lineid).subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const shift_data =
                {
                  shiftid: c._id,
                  shiftname: c.shift,
                  shiftstarttime: c.shiftStartTime,
                  shiftendtime: c.shiftEndTime
                }
                this.Shifts.push(shift_data);
              }

            })
        }
      });
  }

  ngOnInit() {
    this.createFormControlsPDT();
    this.createPDTForm();
    //this.GetcompanyData()
    this.pdt_type.setValue('planned');

    if (!this.lineid) {
      //this.GetPDTData(this.lineid);
      //this.GetShiftData(this.lineid);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    this.lineid = changes.lineid.currentValue;
    //this.GetCompanyID(changes.lineid.currentValue)
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      //this.GetPDTData(changes.lineid.currentValue);
      this.GetShiftData(changes.lineid.currentValue);
      this.GetPDTData(changes.lineid.currentValue);
    }
    //this.GetequipmentData(this.CompanyId);
  }


  ClearElements() {
    this._id.setValue("");
    //this.display_name.setValue
  }

  GetPDTData(lineid) {
    this.PDT= [];
     //this.PDT: [] = [];
     //this.PDT: PDT[] = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/pdt?line_id=' + lineid).subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const pdt_data =
                {
                  pdtid: c._id,
                  pdtname: c.pdt_name,
                  pdttype: c.pdt_type,
                  shiftname: c.shift && c.shift.shiftName ? c.shift.shiftName : '',
                  shiftid: c.shift && c.shift._id ? c.shift._id : '',
                  lineid: c.line_id.line_name,
                  starttime: c && c.start_time ? c.start_time : '',
                  endtime: c && c.end_time ? c.end_time : '',
                  pdtstarttime: c && c.pdt_start_time ? c.pdt_start_time : '',
                  pdtendtime: c && c.pdt_end_time ? c.pdt_end_time : '',

                  displaypdtstart: c && c.start_time ? moment(c.start_time).format('DD-MMM-YYYY hh:mm') : '' + c && c.pdt_start_time ? c.pdt_start_time : '',
                  displaypdtend : c && c.end_time ? moment(c.end_time).format('DD-MMM-YYYY hh:mm') : '' + c && c.pdt_end_time ? c.pdt_end_time : ''
                }
                this.PDT.push(pdt_data);
              }
              this.vdisplayedColumns = [];
              if (Object.keys(data).length > 0) {
                for (let i = 0; i < Object.keys(this.PDT[0]).length; i++) {
                  this.vdisplayedColumns.push(Object.keys(this.PDT[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.PDT);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.displayedColumns = this.vdisplayedColumns;
              }
              else {
                this.gotData = true;
                this.dataSource = null;
                this.displayedColumns = this.vdisplayedColumns;
              }
            })
        }
      });
  }

  postpdtData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.Temp = null;
          if (this.pdt_type.value === "planned") {
            this.Temp = {
              _id: this._id.value,
              shift: this.shift.value,
              pdt_type: this.pdt_type.value,
              pdt_name: this.pdt_name.value,
              pdt_start_time: this.pdt_start_time.value,
              pdt_end_time: this.pdt_end_time.value,
              line_id: this.lineid
            }
          }
          else {
            this.Temp = {
              _id: this._id.value,
              //shift: this.shift.value,
              pdt_type: this.pdt_type.value,
              pdt_name: this.pdt_name.value,
              // pdt_start_time: this.pdt_start_time.value,
              // pdt_end_time: this.pdt_end_time.value,
              start_time: this.datepipe.transform(this.start_time.value, 'yyyy-MM-dd') + "T" + this.pdt_start_time.value,
              line_id: this.lineid,
              end_time: this.datepipe.transform(this.end_time.value, 'yyyy-MM-dd') + "T" + this.pdt_end_time.value
            }
          }
          this.httpClient.post(apipath['server'] + '/api/manual/pdt', this.Temp).subscribe(
            (data: any[]) => {
              this.openSnackBar("Success", "Records has been added/updated successfully");
              this.GetPDTData(this.lineid);

              this.pdtform.reset();
            },
            (error: HttpErrorResponse) => {
              this.gotData = true;
              if (error.status == 409) {
                //this.httpErrorService.onError(error);
                this.openSnackBar("Validation", error.error);

              }
              else if (error.status == 404) {
                //this.httpErrorService.onError(error);
                //this.openSnackBar("Validation", error.error);
                this.dataSource = null;
              }

              else {
                this.openSnackBar("Error", error.error);
              }
            }
          );
        }
      });
  }

  pdtradiochange($event: MatRadioChange) {
    this.PDTchange($event.value);
  }

  PDTchange(value) {
    if (value == 'planned') {
      // Do whatever you want here
      this.selected = false;
      this.showshift = true;
    }
    else {
      this.selected = true;
      this.showshift = false;
    }
  }

  updateRow(element) {
    this.PDTchange(element.pdttype);
    if (element.pdttype === 'planned') {
      this.pdtform.patchValue({
        _id: element.pdtid,
        shift: element.shiftid,
        pdt_type: element.pdttype,
        pdt_name: element.pdtname,
        pdt_start_time: element.pdtstarttime,
        pdt_end_time: element.pdtendtime,
        //start_time: element.pdtstarttime,
        //end_time: element.pdtendtime
      });
    }
    else {
      this.pdtform.patchValue({
        _id: element.pdtid,
        //shift: element.shiftid,
        pdt_type: element.pdttype,
        pdt_name: element.pdtname,
        pdt_start_time: moment(element.starttime).format("hh:mm"),
        pdt_end_time: moment(element.endtime).format("hh:mm"),
        start_time: element.starttime,
        end_time: element.endtime
      });
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
