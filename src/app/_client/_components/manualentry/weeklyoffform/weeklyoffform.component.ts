import { element } from 'protractor';
import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

interface Weeklyoff {
  weekoffid: string,
  weekdays: string[],
  dayname: string
}


@Component({
  selector: 'app-weeklyoffform',
  templateUrl: './weeklyoffform.component.html',
  styleUrls: ['./weeklyoffform.component.scss']
})

export class WeeklyoffformComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Input() plantid: string;
  LineId;
  //CompanyId;
  public Weeklyoff: Weeklyoff[] = [];
  //data=[];
  //Lines: string[] = ['Line 1', 'Line 2'];

  displayedColumns: string[] = [];
  displayedColumnsAs = {
    skuid: { 'DN': 'sku id', 'visible': true },
    skunumber: { 'DN': 'SKU Number', 'visible': false },
    skuname: { 'DN': 'SKU Name', 'visible': false },

  };

  gotData: boolean = false;
  vdisplayedColumns: string[];
  //dataSource = [];
  dataSource: MatTableDataSource<Weeklyoff>;
  EqID = [];
  Eqname = [];
  skuform: FormGroup;

  sku_id: FormControl;
  sku_number: FormControl;
  sku_name: FormControl;


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormControlsSKU() {
    this.sku_id = new FormControl('');
    this.sku_number = new FormControl('', Validators.required);
    this.sku_name = new FormControl('', Validators.required);

  }

  createSKUForm() {
    this.skuform = new FormGroup({
      sku_id: this.sku_id,
      sku_number: this.sku_number,
      sku_name: this.sku_name,

    });
  }
  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) {
  }

  GetWeeklyoff(lineid) {
    this.Weeklyoff = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/sku?line_id=' + lineid).subscribe(
            (data: any[]) => {

              ////----------------------need to change data.length----------------------------------------
              for (let i = 0; i < data.length; i++) {
                const c = data[i];

                const weekly_data =
                {
                  skuid: c._id,
                  skunumber: c.sku_number,
                  skuname: c.sku_name,

                }
                //this.Weeklyoff.push(weekly_data);
              }
              this.vdisplayedColumns = [];
              if (Object.keys(data).length > 0) {
                for (let i = 0; i < Object.keys(this.Weeklyoff[0]).length; i++) {
                  this.vdisplayedColumns.push(Object.keys(this.Weeklyoff[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                //this.vdisplayedColumns.push('delete');
                this.gotData = true;
                //this.dataSource = this.Weeklyoff;
                this.dataSource = new MatTableDataSource(this.Weeklyoff);
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

  ngOnChanges(changes: SimpleChanges): void {
    this.LineId = changes.lineid.currentValue;
    //this.GetCompanyID(changes.lineid.currentValue);
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      this.GetWeeklyoff(changes.lineid.currentValue);
    }
  }

  ngOnInit() {
    this.createFormControlsSKU();
    this.createSKUForm();
    //if (this.LineId != null && this.LineId != "") {
      //this.GetWeeklyoff(this.LineId);
    //}
  }

  postFormData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {

          const T = {
            _id: this.sku_id.value,
            sku_number: this.sku_number.value,
            sku_name: this.sku_name.value,
            line_id: this.LineId,//from @input value

          }
          this.httpClient.post(apipath['server'] + '/api/manual/sku', T).subscribe(
            (data: any[]) => {
              this.openSnackBar("Success", "Records has been added/updated successfully");
              this.GetWeeklyoff(this.LineId);//This.lineid is @input parameter.
              this.skuform.reset();
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
    this.skuform.patchValue({
      sku_id: element.skuid,
      sku_number: parseInt(element.skunumber),
      sku_name: element.skuname,

    });
  }

  deleteRow(element) {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
