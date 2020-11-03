import { element } from 'protractor';
import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
interface Lines {
  lineid: string;
  linename: string;
  linecode: string;
}
interface Holiday {
  holidayid: string;
  holidayname: string;
  holidaydate: string;
  //plantid: string;
  // lineid: string[];
  // lines: string[]
}
@Component({
  selector: 'app-holidaylistform',
  templateUrl: './holidaylistform.component.html',
  styleUrls: ['./holidaylistform.component.scss']
})
export class HolidaylistformComponent implements OnInit {
  @Input() plantid: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //@Input() lineid: string;
  public Holidaydata: Holiday[] = [];
  //Lid = [];
  //Lnames = [];
  displayedColumns: string[];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  dataSource: MatTableDataSource<Holiday>;
  displayedColumnsAs = {
    holidayid: { 'DN': 'Holiday ID', 'visible': true },
    holidayname: { 'DN': 'Holiday Name', 'visible': false },
    holidaydate: { 'DN': 'Holiday Date', 'visible': false }
  }
  //-----------------------------------------------------Holiday List---------------------------------------------
  holidaylistform: FormGroup;

  holidayid: FormControl;
  holidayname: FormControl;
  holidaydate: FormControl;

  createFormControlsHolidayoff() {
    this.holidayid = new FormControl('');
    this.holidayname = new FormControl('', Validators.required);
    this.holidaydate = new FormControl('', Validators.required);
  }

  createHolidayOffForm() {
    this.holidaylistform = new FormGroup({
      holidayid: this.holidayid,
      holidayname: this.holidayname,
      holidaydate: this.holidaydate
    });
  }
  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, public datepipe: DatePipe) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  ngOnInit() {
    this.createFormControlsHolidayoff();
    this.createHolidayOffForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('on change', changes);
    console.log(changes.plantid.currentValue);
    if (changes.plantid.currentValue != "" && changes.plantid.currentValue != null) {
      this.GetHolidaydata(changes.plantid.currentValue);
    }
  }

  GetHolidaydata(plantid) {
    console.log(plantid);
    this.Holidaydata = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/holiday?plant_id=' + plantid).subscribe(
            (data: any[]) => {
              ////----------------------need to change data.length----------------------------------------
              for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
                const c = data[i];

                const Holiday_data =
                {
                  holidayid: c._id,
                  holidayname: c.holiday_name,
                  holidaydate: this.datepipe.transform(c.holiday_date, 'yyyy-MM-dd'),
                  //plantid: this.plantid,
                }
                this.Holidaydata.push(Holiday_data);
              }
              this.vdisplayedColumns = [];
              if (Object.keys(data).length > 0) {
                for (let i = 0; i < Object.keys(this.Holidaydata[0]).length; i++) {
                  this.vdisplayedColumns.push(Object.keys(this.Holidaydata[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.Holidaydata);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.displayedColumns = this.vdisplayedColumns;
              }
            }
          )
        }
      }
    );
  }

  postHolidayFormData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {

          const T = {
            _id: this.holidayid.value,
            holiday_name: this.holidayname.value,
            holiday_date: this.datepipe.transform(this.holidaydate.value, 'yyyy-MM-dd'),
            plant_id: this.plantid,//from @input value

          }
          console.log(T);
          this.httpClient.post(apipath['server'] + '/api/manual/holiday', T).subscribe(
            (data: any[]) => {
              this.openSnackBar("Success", "Records has been added/updated successfully");
              console.log(data);
              this.GetHolidaydata(this.plantid);//This.lineid is @input parameter.
              this.holidaylistform.reset();
            },
            (error: HttpErrorResponse) => {
              if (error.status == 409) {
                this.openSnackBar("Validation", error.error);
              }
              else {
                this.openSnackBar("Error", error.error);
              }
            }
          );
        }
      });
  }

  updateRow(element) {
    console.log(element)
    this.holidaylistform.patchValue({
      holidayid: element.holidayid,
      holidayname: element.holidayname,
      holidaydate: this.datepipe.transform(element.holidaydate, 'yyyy-MM-dd')
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
