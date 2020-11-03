import { ManualEntryService } from './../../manual-entry.service';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobaltypedailogComponent } from './globaltypedailog/globaltypedailog.component';

import { Injectable } from '@angular/core';



interface GlobalType {
  globalTypeid: string;
  globalTypeLineid: string;
  globalTypename: string;
  globalTypevalue: string;
  globalTypeDisplayname: string;
 // lossTypeState: string;
}
@Component({
  selector: 'app-globaltype',
  templateUrl: './globaltype.component.html',
  styleUrls: ['./globaltype.component.scss']
})
 @Injectable()
export class GlobaltypeComponent implements OnInit {

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

  public Gtype: GlobalType[] = [];
  public globalKeys:any [];
  dataSource: MatTableDataSource<GlobalType>;

  displayedColumnsAs = {
    globalTypeid: { 'DN': 'Global Type Id', 'visible': true },
    globalTypeLineid: {'DN': 'Line Id', 'visible': true},
    globalTypename: { 'DN': 'Name', 'visible': false},
    globalTypeDisplayname: { 'DN': 'Display Name', 'visible': false },
    globalTypevalue: { 'DN': 'Type Code', 'visible': false },
  }

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  GetGlobalTypeData(lineid,type='') {
    //console.log("lineID: "+lineid);
    this.Gtype = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

      this.manualentryservice.GetSubstituteData(lineid, 'all', serverdetails['server']).subscribe((globalTypedata: any[]) => {
        for (let i = 0; i < globalTypedata.length; i++) {
          const c = globalTypedata[i];
          const cause_data =
          {
            globalTypeid: c._id,
            globalTypeLineid:lineid,
            globalTypename: c.type,
            globalTypevalue: c.value,
            globalTypeDisplayname: c.display_name,
          }
          this.Gtype.push(cause_data);
          //console.log("cause_data: "+JSON.stringify(cause_data));
        }

        this.vdisplayedColumns = [];
        if (Object.keys(globalTypedata).length > 0) {
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

// send Global Keys to the modal
SendGlobalKeysToModal() {

  this.globalKeys = [];
  this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

    this.manualentryservice.GetSubstituteData(this.lineid, 'globalkey', serverdetails['server']).subscribe((globalkeydata: any[]) => {
      console.log(globalkeydata);
      for (let i = 0; i < globalkeydata.length; i++) {
        const c = globalkeydata[i];
        let a:string [] = [''];
        //console.log(c.value);
        a.push(c.value);
        a.push(c.display_name);
        //console.log("values "+a);
        this.globalKeys.push(a);
        //console.log(this.globalKeys);

      }
      //console.log(this.globalKeys);

    });
  });
  console.log(this.globalKeys);
  return this.globalKeys;
}




  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.lineid = changes.lineid.currentValue;
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      console.log("----ngOnChange function----");
      this.GetGlobalTypeData(this.lineid);
      //changes.lineid.currentValue replaced with '5e5113fbfba653297ef343aa'
    }
  }

  ngOnInit() {
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

  DailogAddGlobalType() {
    const dialogRef = this.dialog.open(GlobaltypedailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          globalKeys: this.SendGlobalKeysToModal(),
          lineid: this.lineid,
          title:'Add Details',
          button: 'Done'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      //this.dialogValue = result.data;
      this.GetGlobalTypeData(this.lineid);
      this.openSnackBar("Success", "Records Added Successfully");
    });
  }

  DailogUpdateGlobalType(element) {
    // console.log("fuction called");
     console.log("this is element: "+JSON.stringify(element));
    const dialogRef = this.dialog.open(GlobaltypedailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          globalKeys: this.SendGlobalKeysToModal(),
          rowdata: element,
          title:'Update Details',
          button: 'Update'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      //this.dialogValue = result.data;
      this.GetGlobalTypeData(this.lineid);
      this.openSnackBar("Success", "Records Updated Successfully");

    });
  }

}
