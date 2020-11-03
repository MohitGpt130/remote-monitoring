import { ManualEntryService } from './../../manual-entry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OperatordailogentryComponent } from './operatordailogentry/operatordailogentry.component';

interface OperatorEntry {
  operatorEntryname: string;
  operatorEntrycode: string;
  operatorEntrydisplayName: string;
  operatorEntryorigin: string;
  operatorEntryid: string;
}

@Component({
  selector: 'app-operatorentry',
  templateUrl: './operatorentry.component.html',
  styleUrls: ['./operatorentry.component.scss']
})
export class OperatorentryComponent implements OnInit {

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
  public Gtype: OperatorEntry[] = [];
  // public globalKeys: any[];
  dataSource: MatTableDataSource<OperatorEntry>;


  displayedColumnsAs = {
    operatorEntryname: { 'DN': 'Name', 'visible': false },
    operatorEntrycode: { 'DN': 'Code', 'visible': false },
    operatorEntryorigin: { 'DN': 'Type', 'visible': false },
    operatorEntrydisplayName: { 'DN': 'Display Name', 'visible': false },
    operatorEntryid: { 'DN': 'Operator ID', 'visible': true }
  }
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  GetOperatorEntryData(lineid) {
    console.log("lineID:Testing");
    this.Gtype = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {
      this.manualentryservice.GetOperatorData(serverdetails['server']).subscribe((OperatorEntrydata: any[]) => {
        console.log(OperatorEntrydata);
        //this.manualentryservice.GetSubstituteData(lineid, 'machinestate', serverdetails['server']).subscribe((OperatorEntrydata: any[]) => {
        for (let i = 0; i < OperatorEntrydata.length; i++) {
          const c = OperatorEntrydata[i];
          const cause_data =
          {
            operatorEntryname: c.operator_name,
            operatorEntrycode: c.code,
            operatorEntrydisplayName: c.display_name ? c.display_name : "",
            operatorEntryorigin: c.origin,
            operatorEntryid: c._id
          }
          this.Gtype.push(cause_data);
        }
        this.vdisplayedColumns = [];
        // console.log(this.Gtype[1]);
        if (Object.keys(OperatorEntrydata).length > 0) {
          for (let i = 0; i < Object.keys(this.Gtype[0]).length; i++) {
            this.vdisplayedColumns.push(Object.keys(this.Gtype[0])[i]);
          }
          this.vdisplayedColumns.push('star');
          this.gotData = true;
          this.dataSource = new MatTableDataSource(this.Gtype);
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
      this.GetOperatorEntryData(this.lineid);
      //changes.lineid.currentValue replaced with '5e5113fbfba653297ef343aa'
    }
  }

  ngOnInit() {
    //this.GetOperatorEntryData(this.lineid);
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


  DailogAddOperatorEntry() {
    const dialogRef = this.dialog.open(OperatordailogentryComponent, {
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

  DailogUpdateOperatorEntry(element) {
    // console.log("fuction called");
    console.log("this is updated: " + JSON.stringify(element));
    const dialogRef = this.dialog.open(OperatordailogentryComponent, {
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
              operator_name: result.operator_name,
              display_name: result.display_name,
              code: result.code,
              origin: result.origin
            }
          }
          else {
            T = {
              _id: null,
              operator_name: result.operator_name,
              display_name: result.display_name,
              code: result.code,
              origin: result.origin

            }
          }
          console.log("Data which is being posted : " + JSON.stringify(T));
          console.log(apipath['server']);
          this.httpClient.post(apipath['server'] + '/api/manual/postoperator', T).subscribe(
            (data: any[]) => {
              console.log(data);
              this.GetOperatorEntryData(this.lineid);
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
