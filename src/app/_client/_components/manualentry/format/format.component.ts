import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormatdailogComponent } from './formatdailog/formatdailog.component';
import { ManualEntryService } from '../../manual-entry.service';

interface Format {
  Formatid: string;
  Formatname: string;
  Formatcode: string;
  Formatblisterperformat: number;
  Formattableperblister: number;

  Formatmachinespeed: number; // Formatlineid: string;
  Formatratedspeed: number;
}

@Component({
  selector: 'app-format',
  templateUrl: './format.component.html',
  styleUrls: ['./format.component.scss']
})
export class FormatComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, public dialog: MatDialog, private manualentryservice: ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  @Input() lineid: string;
  displayedColumns: string[];// = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  public Formattype: Format[] = [];
  // public globalKeys: any[];
  dataSource: MatTableDataSource<Format>;

  displayedColumnsAs = {
    Formatname: { 'DN': 'Name', 'visible': false },
    Formatcode: { 'DN': 'Code', 'visible': false },
    Formatblisterperformat: { 'DN': 'Blister per Format', 'visible': false },
    Formattableperblister: { 'DN': 'Tablet per Blister', 'visible': false },
    Formatmachinespeed: { 'DN': 'Machine Speed', 'visible': false },
    Formatratedspeed: { 'DN': 'Rated Speed', 'visible': false },
    Formatid: { 'DN': 'Format ID', 'visible': true }
    // Formatlineid: {'DN': 'Format line Id', 'visible': false}
  }
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }


  GetFormatData(lineid) {
    console.log(lineid);
    console.log("lineID:Testing");
    this.Formattype = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {
      this.manualentryservice.GetFormatData(serverdetails['server'], serverdetails['line_id']).subscribe((Formatdata: any[]) => {
        console.log(Formatdata);
        //this.manualentryservice.GetSubstituteData(lineid, 'machinestate', serverdetails['server']).subscribe((OperatorEntrydata: any[]) => {
        for (let i = 0; i < Formatdata.length; i++) {
          const c = Formatdata[i];
          console.log(c);
          const format_data =
          {
            Formatid: c._id,
            Formatname: c.format_name,
            Formatcode: c.format_code,
            Formatblisterperformat: c.blister_per_format,
            Formattableperblister: c.tablet_per_blister,
            Formatmachinespeed: c.machine_speed,
            Formatratedspeed: c.rated_speed
          }
          this.Formattype.push(format_data);

        }
        console.log(this.Formattype);
        this.vdisplayedColumns = [];
        console.log(this.Formattype[0]);
        if (Object.keys(Formatdata).length > 0) {
          for (let i = 0; i < Object.keys(this.Formattype[0]).length; i++) {
            this.vdisplayedColumns.push(Object.keys(this.Formattype[0])[i]);
            console.log("function");
          }
          this.vdisplayedColumns.push('star');
          this.gotData = true;
          this.dataSource = new MatTableDataSource(this.Formattype);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.displayedColumns = this.vdisplayedColumns;
        }
        else {
          console.log('else part called');
          this.gotData = true;
          this.dataSource = null;
          this.displayedColumns = this.vdisplayedColumns;
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.lineid = changes.lineid.currentValue;
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      console.log("----ngOnChange function----");
      this.GetFormatData(this.lineid);
      //changes.lineid.currentValue replaced with '5e5113fbfba653297ef343aa'
    }
  }

  ngOnInit() {
    // this.GetFormatData(this.lineid);
    console.log("hi");
  }

  ClearElements() {
    //this._id.setValue("");
  }

  deleteRow(element) {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  DailogAddFormat() {
    const dialogRef = this.dialog.open(FormatdailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          // globalKeys: this.SendGlobalKeysToModal(),
          lineid: this.lineid,
          title: 'Add Details',
          button: 'Done'
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result !== undefined) {
        this.SubmitChanges(result);
        //this.dialogValue = result.data;
        //this.GetOperatorEntryData(this.lineid);
        this.openSnackBar("Success", "Records Added Successfully");
      }
    });
  }


  DailogUpdateFormat(element) {
    console.log("fuction called");
    console.log("this is updated: " + JSON.stringify(element));
    const dialogRef = this.dialog.open(FormatdailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          //  globalKeys: this.SendGlobalKeysToModal(),
          rowdata: element,
          title: 'Update Details',
          button: 'Update'
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      //this.dialogValue = result.data;
      if (result !== undefined) {
        this.SubmitChanges(result);
        //this.dialogValue = result.data;
        this.openSnackBar("Success", "Records Updated Successfully");

      }

    });
  }


  SubmitChanges(result) {
    console.log("I have reached function");
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          var T = {};
          if (result._id !== null) {
            T = {
              _id: result._id,
              format_name: result.format_name,
              format_code: result.format_code,
              blister_per_format: result.blister_per_format,
              tablet_per_blister: result.tablet_per_blister,
              rated_speed: result.rated_speed,
              machine_speed: result.machine_speed,
              line_id: this.lineid
            }
          }
          else {
            T = {
              _id: null,
              format_name: result.format_name,
              format_code: result.format_code,
              blister_per_format: result.blister_per_format,
              tablet_per_blister: result.tablet_per_blister,
              rated_speed: result.rated_speed,
              machine_speed: result.machine_speed,
              line_id: this.lineid
            }
          }
          console.log("Data which is being posted : " + JSON.stringify(T));
          this.httpClient.post('http://13.233.134.82:4200/api/manual/format', T).subscribe(
            (data: any[]) => {
              console.log('update is');
              this.GetFormatData(this.lineid);
              this.openSnackBar("Success", "Records Updated Successfully");

              //this.openSnackBar("Request Successfull");
            },
            (error: HttpErrorResponse) => {
              console.log(error);
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
}




