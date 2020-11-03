import { Component, OnInit, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
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


interface Line {
  lineid: string,
  linename: string,
  linecode: string;
}
@Component({
  selector: 'app-lineform',
  templateUrl: './lineform.component.html',
  styleUrls: ['./lineform.component.scss']
})
export class LineformComponent implements OnInit {

  @Input() plantid: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public Linedata: Line[] = [];
  displayedColumns: string[] = [];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  //dataSource = [];
  dataSource: MatTableDataSource<Line>;

  displayedColumnsAs = {
    lineid: { 'DN': 'Line ID', 'visible': true },
    linecode: { 'DN': 'Line Number', 'visible': false },
    linename: { 'DN': 'Line Name', 'visible': false }
  }

  //---------------------------------------------------------LINE------------------------------------------------
  lineform: FormGroup;
  line_id: FormControl;
  line_code: FormControl;
  line_name: FormControl;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormControlsLine() {
    this.line_id = new FormControl('');
    this.line_code = new FormControl('', Validators.required);
    this.line_name = new FormControl('', Validators.required);
  }

  createLineForm() {
    this.lineform = new FormGroup({
      line_id: this.line_id,
      line_code: this.line_code,
      line_name: this.line_name
    });
  }
  ngOnInit() {
    this.createFormControlsLine();
    this.createLineForm();
    console.log(this.plantid);
    // if (this.plantid != "" && this.plantid != null) {
    //   console.log(this.plantid);
    //   this.GetLinedata(this.plantid);
    // }
    //console.log(this.plantid);
  }

  onFileInput() {
    console.log('file input');
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('on change', changes);
    console.log(changes.plantid.currentValue);
    if (changes.plantid.currentValue != "" && changes.plantid.currentValue != null) {
      this.GetLinedata(changes.plantid.currentValue);
    }
  }

  GetLinedata(plantid) {
    this.Linedata = [];
    console.log(plantid);
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/line/' + plantid).subscribe(
            (data: any[]) => {
              //console.log(data);
              this.vdisplayedColumns = [];
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const line_data =
                {
                  lineid: c._id,
                  linename: c.line_name,
                  linecode: c.line_code
                }
                this.Linedata.push(line_data);
              }
              if (Object.keys(data).length > 0) {
                for (let i = 0; i < Object.keys(this.Linedata[0]).length; i++) {
                  //console.log(Object.keys(this.Equipments[0])[i]);
                  this.vdisplayedColumns.push(Object.keys(this.Linedata[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                //this.vdisplayedColumns.push('delete');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.Linedata);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.displayedColumns = this.vdisplayedColumns;
              }
            },
            (error: HttpErrorResponse) => {
              this.gotData = true;
              //this.dataSource = null;
              if (error.status == 409) {
                this.openSnackBar("Validation", error.error);
              }
              else if (error.status == 404) {
                this.dataSource = null;
              }
              else {
                this.openSnackBar("Error", error.error);
              }
            }
          )
        }
      }
    );
  }

  postLineFormData() {
    console.log(this.lineform.value);
    //console.log(this.lineform.valid);
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          console.log(this.lineform.value);
          const T = {
            _id: this.line_id.value,
            line_code: this.line_code.value,
            line_name: this.line_name.value,
            plant_id: this.plantid
          }
          console.log(T);
          this.httpClient.post(apipath['server'] + '/api/manual/line', T).subscribe(
            (data: any[]) => {
              console.log(data);
              this.openSnackBar("Success", "Records has been added/updated successfully");
              this.GetLinedata(this.plantid);
              this.lineform.reset();
            },
            (error: HttpErrorResponse) => {
              this.gotData = true;
              console.log(error);
              if (error.status == 409) {
                //this.httpErrorService.onError(error);
                this.openSnackBar("Validation", error.message);

              }
              else if (error.status == 404) {
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
  updateRow(element) {
    console.log(element);
    this.lineform.patchValue({
      line_id: element.lineid,
      line_code: element.linecode,
      line_name: element.linename
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
