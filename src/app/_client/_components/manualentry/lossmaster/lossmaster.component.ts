import { ManualEntryService } from './../../manual-entry.service';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LossdailogComponent } from './lossdailog/lossdailog.component';

interface Loss {
  lossId: string;
  lossType: string;
  lossDisplayname: string;
  lossValue: string;
  lossState: string;
  lossLang: string;
}
interface LossType {
  lossTypeid: string;
  lossTypename: string;
  lossTypevalue: string;
  lossTypeDisplayname: string;
  // lossTypeState: string;
}

interface MachineState {
  stateid: string;
  value: string;
  displayName: string;
  lineid: string;
}

@Component({
  selector: 'app-lossmaster',
  templateUrl: './lossmaster.component.html',
  styleUrls: ['./lossmaster.component.scss']
})

export class LossmasterComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, public dialog: MatDialog, private manualentryservice: ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  @Input()
  lineid: string;
  displayedColumns: string[];// = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];

  public LossData: Loss[] = [];
  public machineStates: any[];
  public lossTypes: any[];
  //public MachinesStates: MachineState[] = [];
  dataSource: MatTableDataSource<Loss>;
  displayedColumnsAs = {
    lossId: { 'DN': 'Machine Id', 'visible': true },
    lossType: { 'DN': 'Loss Type', 'visible': false },
    lossDisplayname: { 'DN': 'Display Name', 'visible': false },
    lossValue: { 'DN': 'Value', 'visible': false },
    lossState: { 'DN': 'State', 'visible': false },
    lossLang: { 'DN': 'Language', 'visible': false },
    faultid: { 'DN': 'ID', 'visible': true },

  }

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  Machines: string[];
  allmachines;

  allmachinestates;
  States;

  GetLossData() {
    console.log(this.lineid);
    this.LossData = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {
      //serverdetails['line_id'] replaced with 5e5113fbfba653297ef343aa
      this.manualentryservice.GetLossData(this.lineid, 'all', serverdetails['server']).subscribe((lossdata: any[]) => {
        for (let i = 0; i < lossdata.length; i++) {
          const c = lossdata[i];
          const cause_data =
          {
            lossId: c._id,
            lossType: c.type,
            lossValue: c.value,
            lossDisplayname: c.display_name,
            lossState: c.state,
            lossLang: c.another_language_name
          }
          this.LossData.push(cause_data);
          //console.log("cause_data: "+JSON.stringify(cause_data));
        }

        this.vdisplayedColumns = [];
        if (Object.keys(lossdata).length > 0) {
          for (let i = 0; i < Object.keys(this.LossData[0]).length; i++) {
            this.vdisplayedColumns.push(Object.keys(this.LossData[0])[i]);
          }
          this.vdisplayedColumns.push('star');
          this.gotData = true;
          this.dataSource = new MatTableDataSource(this.LossData);
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
  // send machine states to the modal
  SendMachineStatesToModal() {

    this.machineStates = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

      this.manualentryservice.GetSubstituteData(this.lineid, 'machinestate', serverdetails['server']).subscribe((lossdata: any[]) => {
        //console.log(lossdata);
        for (let i = 0; i < lossdata.length; i++) {
          const c = lossdata[i];
          let a: string[] = [''];
          //console.log(c.value);
          a.push(c.value);
          a.push(c.display_name);
          //console.log("values "+a);
          this.machineStates.push(a);
          // console.log(this.machineStates);
        }
        //console.log(this.machineStates);
      });
    });
    return this.machineStates;
  }

  // send machine states to the modal
  SendLossTypesToModal() {
    this.lossTypes = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {
      this.manualentryservice.GetSubstituteData(this.lineid, 'losscategory', serverdetails['server']).subscribe((losstypes: any[]) => {
        //console.log(losstypes);
        for (let i = 0; i < losstypes.length; i++) {
          const c = losstypes[i];
          let a: string[] = [''];
          //console.log(c.value);
          a.push(c.value);
          a.push(c.display_name);
          //  console.log("values "+a);
          this.lossTypes.push(a);
          // console.log(this.machineStates);
        }
        // console.log(this.lossTypes);
      });
    });
    return this.lossTypes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.lineid = changes.lineid.currentValue;
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      this.GetLossData();

    }
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  DailogAddLosses() {
    const dialogRef = this.dialog.open(LossdailogComponent, {
      width: '500px',
      height: '600px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          losstypes: this.SendLossTypesToModal(),
          stateofMachine: this.SendMachineStatesToModal(),
          rowdata: '',
          show: 'false',
          title: 'Add Loss Details',
          button: 'Done'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      //this.dialogValue = result.data;
      this.SubmitChanges(result);
      // this.GetLossData();
      // console.log("added");
      this.openSnackBar("Success", "Records Added Successfully");
    });
  }

  DailogUpdateLosses(element) {
    // console.log("fuction called");
    console.log("this is updated: " + JSON.stringify(element));
    const dialogRef = this.dialog.open(LossdailogComponent, {
      width: '500px',
      height: '600px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          losstypes: this.SendLossTypesToModal(),
          stateofMachine: this.SendMachineStatesToModal(),
          rowdata: element,
          show: 'true',
          title: 'Update Loss Details',
          button: 'Update'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result !== undefined) {
        this.SubmitChanges(result);
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
              value: result.value,
              type: result.type,
              display_name: result.display_name,
              line_id: this.lineid,
              state: result.state,
              another_language_name: result.another_language_name
            }
          }
          else {
            T = {
              //_id: null,
              value: result.value,
              type: result.type,
              display_name: result.display_name,
              line_id: this.lineid,
              state: result.state,
              another_language_name: result.another_language_name
            }
          }

          console.log("Data which is being posted : " + JSON.stringify(T));
          console.log(apipath['server']);
          this.httpClient.post(apipath['server'] + '/api/loss', T).subscribe(
            (data: any[]) => {
              console.log(data);
              this.openSnackBar("Success", "Records Updated Successfully");
              this.GetLossData();
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
