import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FgexdailogComponent } from './fgexdailog/fgexdailog.component';
import { ManualEntryService } from '../../manual-entry.service';

interface Fgex {
  Fgexid?: string;
  Fgexno?: number;
  Fgexproductname?: string;
  Fgexhalbcode?: string;
  Fgexpack?: number;
 // Fgextype?: string;
  FgextypeId?: string;
  Fgextypename?:string;
  Fgexlayout?: number;
  Fgexblistersize?: string;
  Fgexcurrentmachine?: string;
  Fgexblisterperformat?: number;
  Fgexcycle?: number;
  Fgexratedspeed?: number;
  Fgextablet?: number; // Formatlineid: string;

}



@Component({
  selector: 'app-fgex',
  templateUrl: './fgex.component.html',
  styleUrls: ['./fgex.component.scss']
})
export class FgexComponent implements OnInit {
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
  public Fgextype: Fgex[] = [];
  public globalKeys: any[];
  dataSource: MatTableDataSource<Fgex>;

  displayedColumnsAs = {
    Fgexid: { 'DN': 'ID', 'visible': true },
    Fgexno: { 'DN': 'Fgex No.', 'visible': false },
    Fgexproductname: { 'DN': 'Product Name', 'visible': false },
    Fgexhalbcode: { 'DN': 'Halb-Code', 'visible': false },
    Fgexpack: { 'DN': 'Pack', 'visible': false },
    //Fgextype: { 'DN': 'Type', 'visible': false },
    Fgextypename: {'DN': 'Type', 'visible': false},
    FgextypeId: {'DN': 'Type', 'visible': true},
    Fgexlayout: { 'DN': 'Layout No.', 'visible': false },
    Fgexblistersize: { 'DN': 'Blister Size', 'visible': false },
    Fgexcurrentmachine: { 'DN': 'Current Machine', 'visible': false },
    Fgexblisterperformat: { 'DN': 'Format', 'visible': false },
    Fgexcycle: { 'DN': 'Cycle', 'visible': false },
    Fgexratedspeed: { 'DN': 'Blister Per Minute', 'visible': false },
    Fgextablet: { 'DN': 'Tablet Per Blister', 'visible': false },
  }
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  GetFgexData(lineid) {
    console.log(lineid);
    console.log("lineID:Testing");
    this.Fgextype = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {
      this.manualentryservice.GetFgexData(serverdetails['server']).subscribe((Fgexdata: any[]) => {
        console.log(Fgexdata);
        for (let i = 0; i < Fgexdata.length; i++) {
          const c = Fgexdata[i];
          console.log(c);
          const fgex_data =
          {
            Fgexid: c._id,
            Fgexno: c.fgex,
            Fgexproductname: c.product_name,
            Fgexhalbcode: c.halb_code,
            Fgexpack: c.pack,
           // Fgextype: c.type,
            FgextypeId: c && c.type && c.type._id,
            Fgextypename:c && c.type && c.type.display_name,
            Fgexlayout: c.layout_no,
            Fgexblistersize: c.blister_size,
            Fgexcurrentmachine: c.current_machine,
            Fgexblisterperformat: c.blister_per_format,
            Fgexcycle: c.machine_cycle,
            Fgexratedspeed: c.rated_speed,
            Fgextablet: c.tablet_per_blister,

          }
          this.Fgextype.push(fgex_data);

        }
        console.log(this.Fgextype);
        this.vdisplayedColumns = [];
        console.log(this.Fgextype[0]);
        if (Object.keys(Fgexdata).length > 0) {
          for (let i = 0; i < Object.keys(this.Fgextype[0]).length; i++) {
            this.vdisplayedColumns.push(Object.keys(this.Fgextype[0])[i]);
            console.log("function");
          }
          this.vdisplayedColumns.push('star');
          this.gotData = true;
          this.dataSource = new MatTableDataSource(this.Fgextype);
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

  SendGlobalKeysToModal() {

    this.globalKeys = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

      this.manualentryservice.GetSubstituteData(this.lineid, 'fgextype', serverdetails['server']).subscribe((globalkeydata: any[]) => {
        console.log(globalkeydata);
        for (let i = 0; i < globalkeydata.length; i++) {
          const c = globalkeydata[i];
          let a:string [] = [''];
          //console.log(c.value);
          a.push(c._id);
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
      this.GetFgexData(this.lineid);
      //changes.lineid.currentValue replaced with '5e5113fbfba653297ef343aa'
    }
  }

  ngOnInit() {
    console.log('1st');

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

  DailogAddFgex() {
    console.log('add details');
    const dialogRef = this.dialog.open(FgexdailogComponent, {
      width: '600px',
      height: '500px'
      ,
      data: {
        dataKey: {
          globalKeys: this.SendGlobalKeysToModal(),
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

  DailogUpdateFgex(element) {
    console.log("fuction called");
    console.log("this is updated: " + JSON.stringify(element));
    const dialogRef = this.dialog.open(FgexdailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          globalKeys: this.SendGlobalKeysToModal(),
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
              fgex: result.fgex,
              product_name: result.product_name,
              halb_code: result.halb_code,
              pack: result.pack,
              type: result.type,
             // display_name: result.display_name,
              layout_no: result.layout_no,
              blister_size: result.blister_size,
              current_machine: result.current_machine,
              blister_per_format: result.blister_per_format,
              machine_cycle: result.machine_cycle,
              rated_speed: result.rated_speed,
              tablet_per_blister: result.tablet_per_blister,
              line_id: this.lineid
            }
          }
          else {
            T = {
              _id: null,
              fgex: result.fgex,
              product_name: result.product_name,
              halb_code: result.halb_code,
              pack: result.pack,
              type: result.type,
             // display_name: result.display_name,
              layout_no: result.layout_no,
              blister_size: result.blister_size,
              current_machine: result.current_machine,
              blister_per_format: result.blister_per_format,
              machine_cycle: result.machine_cycle,
              rated_speed: result.rated_speed,
              tablet_per_blister: result.tablet_per_blister,
              line_id: this.lineid,

            }
          }
          console.log("Data which is being posted : " + JSON.stringify(T));
          console.log(apipath['server']+ '/api/fgex');

          this.httpClient.post(apipath['server'] + '/api/fgex', T).subscribe(
            (data: any[]) => {
              console.log(data);
              this.GetFgexData(this.lineid);
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
