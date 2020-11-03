import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ɵConsole,
  ViewChild,
} from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeovertypedailogComponent } from './changeovertypedailog/changeovertypedailog.component';
import { ManualEntryService } from '../../manual-entry.service';

interface ChangeOver {
  changeoverid: string;
  changeovertype: string;
  changeovername: string;
  changeoverduration: number;
}

@Component({
  selector: 'app-changeovertype',
  templateUrl: './changeovertype.component.html',
  styleUrls: ['./changeovertype.component.scss'],
})
export class ChangeovertypeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private manualentryservice: ManualEntryService
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  @Input() lineid: string;
  displayedColumns: string[]; // = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  public Gtype: ChangeOver[] = [];
  // public globalKeys: any[];
  dataSource: MatTableDataSource<ChangeOver>;

  displayedColumnsAs = {
    changeoverid: { DN: 'ID', visible: true },
    changeovertype: { DN: 'Type', visible: false },
    changeovername: { DN: 'Change Over Name', visible: false },
    changeoverduration: { DN: 'Standard Duration', visible: false },
  };
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  GetChangeOverData(lineid) {
    this.Gtype = [];
    this.manualentryservice.GetServerAPIPath().subscribe((serverdetails) => {
      this.manualentryservice
        .GetChangeOverData(serverdetails['server'])
        .subscribe((changeoverdata: any[]) => {
          //this.manualentryservice.GetSubstituteData(lineid, 'machinestate', serverdetails['server']).subscribe((OperatorEntrydata: any[]) => {
          for (let i = 0; i < changeoverdata.length; i++) {
            const c = changeoverdata[i];
            const cause_data = {
              changeoverid: c._id,
              changeovertype: c.changeover_type,
              changeovername: c.changeover_name,
              changeoverduration: c.standard_duration,
            };
            this.Gtype.push(cause_data);
          }
          this.vdisplayedColumns = [];
          if (Object.keys(changeoverdata).length > 0) {
            for (let i = 0; i < Object.keys(this.Gtype[0]).length; i++) {
              this.vdisplayedColumns.push(Object.keys(this.Gtype[0])[i]);
            }
            this.vdisplayedColumns.push('star');
            this.gotData = true;
            this.dataSource = new MatTableDataSource(this.Gtype);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.displayedColumns = this.vdisplayedColumns;
          } else {
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
    if (
      changes.lineid.currentValue != null &&
      changes.lineid.currentValue != ''
    ) {
      this.GetChangeOverData(this.lineid);
      //changes.lineid.currentValue replaced with '5e5113fbfba653297ef343aa'
    }
  }

  ngOnInit() {
    //this.GetChangeOverData(this.lineid);
  }
  ClearElements() {
    //this._id.setValue("");
  }

  deleteRow(element) {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  DailogAddChangeOver() {
    const dialogRef = this.dialog.open(ChangeovertypedailogComponent, {
      width: '500px',
      height: '400px',
      data: {
        dataKey: {
          // globalKeys: this.SendGlobalKeysToModal(),
          lineid: this.lineid,
          title: 'Add Details',
          button: 'Done',
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.SubmitChanges(result);
        //this.dialogValue = result.data;
        //this.GetOperatorEntryData(this.lineid);
        this.openSnackBar('Success', 'Records Added Successfully');
      }
    });
  }
  DailogUpdateChangeOver(element) {
    const dialogRef = this.dialog.open(ChangeovertypedailogComponent, {
      width: '500px',
      height: '400px',
      data: {
        dataKey: {
          lineid: this.lineid,
          //  globalKeys: this.SendGlobalKeysToModal(),
          rowdata: element,
          title: 'Update Details',
          button: 'Update',
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //this.dialogValue = result.data;
      if (result !== undefined) {
        this.SubmitChanges(result);
        //this.dialogValue = result.data;
        this.openSnackBar('Success', 'Records Updated Successfully');
      }
    });
  }

  SubmitChanges(result) {
    this.httpClient.get('configs/apix/api_server.json').subscribe((apipath) => {
      if (apipath['server'] !== undefined) {
        var T = {};
        if (result._id !== null) {
          T = {
            _id: result._id,
            changeover_type: result.changeover_type,
            changeover_name: result.changeover_name,
            standard_duration: result.standard_duration,
          };
        } else {
          T = {
            _id: null,
            changeover_type: result.changeover_type,
            changeover_name: result.changeover_name,
            standard_duration: result.standard_duration,
          };
        }
        this.httpClient
          .post(apipath['server']+'/api/changeovermaster', T)
          .subscribe(
            (data: any[]) => {
              this.GetChangeOverData(this.lineid);
              this.openSnackBar('Success', 'Records Updated Successfully');

              //this.openSnackBar("Request Successfull");
            },
            (error: HttpErrorResponse) => {
              if (error.status == 409) {
                this.openSnackBar('Validation', error.error);
              } else {
                this.openSnackBar('Error', error.error);
              }
            }
          );
      }
    });
  }
}
