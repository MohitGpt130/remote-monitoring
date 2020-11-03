import { ManualEntryService } from './../../manual-entry.service';

import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

interface Equipment {
  equipmentid: string,
  lineid: string,
  equipmentdisplayname: string
}

interface Cause {
  faultid: string,
  machine_id: string,
  machine_name: string,
  cause_name: string,
  //fault_name: string,
  line_name: string,
  machine_state: string
}
@Component({
  selector: 'app-faultcauseform',
  templateUrl: './faultcauseform.component.html',
  styleUrls: ['./faultcauseform.component.scss']
})
export class FaultcauseformComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, protected dataentryservice:ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  @Input() lineid: string;
  displayedColumns: string[];// = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  public CauseData: Cause[] = [];
  //dataSource = [];
  dataSource: MatTableDataSource<Cause>;
  displayedColumnsAs = {
    machine_id: { 'DN': 'Machine Id', 'visible': true },
    machine_name: { 'DN': 'Machine Name', 'visible': false },
    cause_name: { 'DN': 'Cause name', 'visible': false },
    machine_state: { 'DN': 'Machine State', 'visible': false },
    faultid: { 'DN': 'ID', 'visible': true }
  }
  public Equipments: Equipment[] = [];

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  otherstatecauseform: FormGroup;
  //3 formcontrols used in page as below
  _id: FormControl;
  machine_name: FormControl;
  cause_name: FormControl;
  machine_state: FormControl;

  //For machines names
  Machines: string[];
  allmachines;

  //For machine states
  allmachinestates;
  States;


  createFormControlsFaultCause() {
    this._id = new FormControl('');
    this.machine_name = new FormControl('', Validators.required);
    this.cause_name = new FormControl('', Validators.required);
    this.machine_state = new FormControl('', Validators.required);
  }

  createFaultCauseForm() {
    this.otherstatecauseform = new FormGroup({
      _id: this._id,
      machine_name: this.machine_name,
      cause_name: this.cause_name,
      machine_state: this.machine_state
    });
  }

  GetFaultCauseData(lineid) {
    console.log(this.lineid);
    this.CauseData = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/faultCause?line_id=' + lineid).subscribe(
            (data: any[]) => {
              //this.allmachines = apipath['machines'];
              //console.log(this.States);
              this.States = Object.keys(apipath['machinestates'])
              this.allmachinestates = apipath['machinestates'];
              // console.log(this.Machines);
              // console.log(apipath['allmachines'][this.Machines[0]]['display_name']);
              // console.log(data);

              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const cause_data =
                {
                  faultid: c._id,
                  machine_id: c.machine_name._id,
                  machine_name: c.machine_name.display_name,
                  cause_name: c.cause_name,
                  //fault_name: c.cause_name,
                  line_name: c.line_name,
                  machine_state: c.machine_state
                }
                this.CauseData.push(cause_data);
              }
              console.log(this.CauseData);

              this.vdisplayedColumns = [];
              //console.log(Object.keys(data[0]).length);
              if (Object.keys(data).length > 0) {
                for (let i = 0; i < Object.keys(this.CauseData[0]).length; i++) {
                  //console.log(Object.keys(data[0])[i]);
                  this.vdisplayedColumns.push(Object.keys(this.CauseData[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                //this.vdisplayedColumns.push('delete');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.CauseData);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                //this.dataSource = this.CauseData;
                //console.log(data);
                //console.log(this.vdisplayedColumns);
                this.displayedColumns = this.vdisplayedColumns;
              }
              else {
                console.log('else part called');
                this.gotData = true;
                this.dataSource = null;
                this.displayedColumns = this.vdisplayedColumns;
              }
            }
          )
        }
      }
    );
  }

  GetequipmentData(lineid) {
    console.log(lineid);
    this.Equipments = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.dataentryservice.GetEquipmentdata(apipath['line_id'], apipath['server'], 'machine').subscribe((data: any[]) => {
              //console.log(Object.keys(data).length);
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const Equipment_data =
                {
                  equipmentid: c._id,
                  lineid: c.line_id._id,
                  equipmentdisplayname: c.display_name,
                }
                this.Equipments.push(Equipment_data);
              }
              // console.log(this.Equipments);
            }
          )
        }
      }
    );
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //console.log('on change', changes);
    console.log(changes.lineid.currentValue);

    this.lineid = changes.lineid.currentValue;
    //console.log(changes.lineid.currentValue);
    //this.GetCompanyID(changes.lineid.currentValue)
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      this.GetequipmentData(changes.lineid.currentValue);
      this.GetFaultCauseData(changes.lineid.currentValue);
    }
    //console.log(this.CompanyId);
  }

  ngOnInit() {
    this.createFormControlsFaultCause();
    this.createFaultCauseForm();
    // if (this.lineid != null && this.lineid != "") {
    //   this.GetFaultCauseData(this.lineid);
    // }

  }

  ClearElements() {
    this._id.setValue("");
    //this.cause_name.setValue
  }

  postFaultcauseData() {
    console.log(this.otherstatecauseform.value);
    //console.log(this.faultcauseform.valid);
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {

          const T = {
            _id: this._id.value,
            machine_name: this.machine_name.value,
            machine_state: this.machine_state.value,
            cause_name: this.cause_name.value,
            fault_name: this.cause_name.value,//Same Value have been send as Cause Name.
            line_id: this.lineid
          }
          console.log(T);
          this.httpClient.post(apipath['server'] + '/api/manual/faultCause', T).subscribe(
            (data: any[]) => {
              console.log(data);
              this.openSnackBar("Success", "Records has been added/updated successfully");
              this.GetFaultCauseData(this.lineid);
              this.otherstatecauseform.reset();
            },
            (error: HttpErrorResponse) => {
              //console.log('HTTPERROR INTERCEPTOR');
              //console.log(error);
              if (error.status == 409) {
                //this.httpErrorService.onError(error);
                this.openSnackBar("Validation", error.error);
              }
              else {
                this.openSnackBar("Error", error.error);
              }
            }
          );
        }
      });
    //}
  }
  deleteRow(element) {

  }

  updateRow(element) {
    console.log(element)
    this.otherstatecauseform.patchValue({
      _id: element.faultid,
      machine_name: element.machine_id,
      cause_name: element.cause_name,
      machine_state: element.machine_state
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
