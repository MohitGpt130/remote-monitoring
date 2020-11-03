import { ManualEntryService } from './../../manual-entry.service';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { GlobalkeydailogComponent } from './globalkeydailog/globalkeydailog.component';

interface GlobalKey {
  globalKeyid: string;
  globalKeyLineid: string;
  globalKeyname: string;
  globalKeyvalue: string;
  globalKeyDisplayname: string;
 // lossTypeState: string;
}

@Component({
  selector: 'app-globalkeymaster',
  templateUrl: './globalkeymaster.component.html',
  styleUrls: ['./globalkeymaster.component.scss']
})



export class GlobalkeymasterComponent implements OnInit {

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
  public addition :any = [];
  public display : any = [];

  public Gtype: GlobalKey[] = [];
  dataSource: MatTableDataSource<GlobalKey>;

  displayedColumnsAs = {
    globalKeyid: { 'DN': 'Global Type Id', 'visible': true },
    globalKeyLineid: {'DN': 'Line Id', 'visible': true},
    globalKeyname: { 'DN': 'Name', 'visible': true},
    globalKeyDisplayname: { 'DN': 'Display Name', 'visible': false },
    globalKeyvalue: { 'DN': 'Key Name', 'visible': false },
  }

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  GetglobalKeyData(lineid,type='') {
    //console.log(this.lineid);
    this.Gtype = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

      this.manualentryservice.GetSubstituteData(lineid, 'globalkey', serverdetails['server']).subscribe((globalKeydata: any[]) => {
        console.log(globalKeydata);
        for (let i = 0; i < globalKeydata.length; i++) {
          const c = globalKeydata[i];
          const cause_data =
          {
            globalKeyid: c._id,
            globalKeyLineid:lineid,
            globalKeyname: c.type,
            globalKeyvalue: c.value,
            globalKeyDisplayname: c.display_name,
          }
          this.Gtype.push(cause_data);
          //console.log("success");
          //console.log("cause_data: "+JSON.stringify(cause_data));
        }

        this.vdisplayedColumns = [];
        if (Object.keys(globalKeydata).length > 0) {
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
      console.log("hello");
      this.GetglobalKeyData(this.lineid);
    }
  }

  ngOnInit() {
    this.display=this.addition.sort();
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

  DailogAddglobalKey() {
    const dialogRef = this.dialog.open(GlobalkeydailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          title:'Add Details',
          button: 'Done'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      //this.dialogValue = result.data;
      this.openSnackBar("Success", "Records Added Successfully");
      this.GetglobalKeyData(this.lineid);

    });
  }

  DailogUpdatedglobalKey(element) {
    // console.log("fuction called");
    // console.log(JSON.stringify(element));
    const dialogRef = this.dialog.open(GlobalkeydailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          rowdata: element,
          title:'Update Details',
          button: 'Update'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.openSnackBar("Success", "Record Updated Successfully");
      //this.dialogValue = result.data;
      this.GetglobalKeyData(this.lineid);


    });
  }

}
