import { ManualEntryService } from './../../manual-entry.service';
import { UpdtdefinitiondailogComponent } from './updtdefinitiondailog/updtdefinitiondailog.component';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

interface updtDefinition {
  updtDefinitionId: string;
  starttime: string;
  endtime: string;
  losstypeid: string;
  losstypename: string;
  causeid: string;
  causename: string;
}
interface LossType {
  lossTypeid: string;
  lossTypename: string;
  lossTypevalue: string;
  lossTypeDisplayname: string;
}

interface LossCategory {
  losscategoryid: string;
  losscategoryvalue: string;
  displayName: string;
}

@Component({
  selector: 'app-updtdefinition',
  templateUrl: './updtdefinition.component.html',
  styleUrls: ['./updtdefinition.component.scss']
})

export class UpdtdefinitionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, public dialog: MatDialog,
    private manualentryservice: ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  @Input() lineid: string;
  displayedColumns: string[]; false;
  vdisplayedColumns: string[];
  gotData: boolean = false;

  public updtDefinitionData: updtDefinition[] = [];
  public machineStates: any[];
  public lossTypes: any[];
  //public MachinesStates: MachineState[] = [];
  dataSource: MatTableDataSource<updtDefinition>;
  displayedColumnsAs = {
    updtDefinitionId: { 'DN': 'updtDefinitionId', 'visible': true },
    starttime: { 'DN': 'Start Time', 'visible': false },
    endtime: { 'DN': 'End Time', 'visible': false },
    losstypeid: { 'DN': 'Loss Type Id', 'visible': false },
    losstypename: { 'DN': 'Loss Type Name', 'visible': false },
    causeid: { 'DN': 'Cause Id', 'visible': false },
    causename: { 'DN': 'Cause Name', 'visible': false }
  }

  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  LossCategory;
  allmachines;

  allmachinestates;
  States;

  GetupdtDefinitionData() {
    this.updtDefinitionData = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {
      //serverdetails['line_id'] replaced with 5e5113fbfba653297ef343aa
      this.manualentryservice.GetUPDTDefintitionData(this.lineid, serverdetails['server']).subscribe((updtDefinitionData: any[]) => {
        for (let i = 0; i < updtDefinitionData.length; i++) {
          const c = updtDefinitionData[i];
          const updt_data =
          {
            updtDefinitionId: c._id,
            starttime: c && c.start_time ? moment(c.start_time).format('DD-MMM-YYYY hh:mm') : '',
            endtime: c && c.end_time ? moment(c.end_time).format('DD-MMM-YYYY hh:mm') : '' ,
            losstypeid: c.loss_type._id + '/' + c.loss_type.value,
            losstypename: c.loss_type.display_name,
            causeid: c.cause_id._id,
            causename: c.cause_id.display_name
          }
          this.updtDefinitionData.push(updt_data);
        }

        this.vdisplayedColumns = [];
        if (Object.keys(updtDefinitionData).length > 0) {
          for (let i = 0; i < Object.keys(this.updtDefinitionData[0]).length; i++) {
            this.vdisplayedColumns.push(Object.keys(this.updtDefinitionData[0])[i]);
          }
          this.vdisplayedColumns.push('star');
          this.gotData = true;
          this.dataSource = new MatTableDataSource(this.updtDefinitionData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayedColumns = this.vdisplayedColumns;
        }
        else {
          this.gotData = true;
          this.dataSource = null;
          this.displayedColumns = this.vdisplayedColumns;
        }
      });
    });
  }
  // send machine states to the modal
  SendLossCategoryToDailog(type) {
    this.LossCategory = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {
      this.manualentryservice.GetLossData(this.lineid, type, serverdetails['server']).subscribe((Losscategorydata: any[]) => {
        for (let i = 0; i < Losscategorydata.length; i++) {
          const c = Losscategorydata[i];
          let a: string[] = [''];
          a.push(c._id);
          a.push(c.value);
          a.push(c.display_name);
          this.LossCategory.push(a);
        }
      });
    });
    return this.LossCategory;
  }

  //ShutDOwn Losses, Downtime
  SendLossTypesToDailog() {
    this.lossTypes = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {
      this.manualentryservice.GetSubstituteData(this.lineid, 'losscategory', serverdetails['server']).subscribe((losstypes: any[]) => {
        for (let i = 0; i < losstypes.length; i++) {
          const c = losstypes[i];
          let a: string[] = [''];
          a.push(c._id + '/' + c.value);
          //a.push(c.value);
          a.push(c.display_name);
          this.lossTypes.push(a);
        }
      });
    });
    return this.lossTypes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.lineid = changes.lineid.currentValue;
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      this.GetupdtDefinitionData();
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

  DailogAddUPDTDefinition() {
    const dialogRef = this.dialog.open(UpdtdefinitiondailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          losstypes: this.SendLossTypesToDailog(),
          causetypes: null,//this.SendLossCategoryToDailog(),
          rowdata: '',
          show: 'false',
          title: 'Add UPDT Details',
          button: 'Done'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.SubmitChanges(result);
        this.openSnackBar("Success", "Records Added Successfully");
      }
    });
  }

  DailogEditUPDTDefinition(element) {
    const dialogRef = this.dialog.open(UpdtdefinitiondailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          losstypes: this.SendLossTypesToDailog(),
          causetypes: this.SendLossCategoryToDailog(element.losstypeid.split('/')[1]),
          rowdata: element,
          show: 'true',
          title: 'Edit UPDT Definition',
          button: 'Update'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.SubmitChanges(result);
      }
    });
  }

  SubmitChanges(result) {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          var T = {};
          if (result._id !== null) {
            T = {
              _id: result._id,
              cause_id: result.cause_id,
              end_time: moment(result.end_time).format("YYYY-MM-DDTHH:mm"),//result.end_time,
              loss_type: result.loss_type.split('/')[0],
              line_id: this.lineid,
              start_time: moment(result.start_time).format("YYYY-MM-DDTHH:mm")//result.start_time,
            }
          }
          else {
            T = {
              _id: null,
              cause_id: result.cause_id,
              end_time: moment(result.end_time).format("YYYY-MM-DDTHH:mm"),
              loss_type: result.loss_type.split('/')[0],
              line_id: this.lineid,
              start_time: moment(result.start_time).format("YYYY-MM-DDTHH:mm"),
            }
          }
          this.httpClient.post(apipath['server'] + '/api/updt', T).subscribe(
            (data: any[]) => {
              this.openSnackBar("Success", "Records Updated Successfully");
              this.GetupdtDefinitionData();
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
}
