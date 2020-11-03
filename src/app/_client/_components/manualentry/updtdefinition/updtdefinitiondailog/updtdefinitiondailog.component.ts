import { ManualEntryService } from './../../../manual-entry.service';;
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-updtdefinitiondailog',
  templateUrl: './updtdefinitiondailog.component.html',
  styleUrls: ['./updtdefinitiondailog.component.scss']
})
export class UpdtdefinitiondailogComponent implements OnInit {

  updtdefinitionform: FormGroup;
  _id: FormControl;
  start_time: FormControl;
  end_time: FormControl;
  loss_type: FormControl;
  cause_id: FormControl;
  todaydate = new Date();

  lineid;
  losstypes;
  causetypes;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UpdtdefinitiondailogComponent>,
    private httpClient: HttpClient, private _snackBar: MatSnackBar, protected dataentryservice: ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  createFormControlsUPDTdefinition() {
    this._id = new FormControl(null);
    this.start_time = new FormControl(null, Validators.required);
    this.end_time = new FormControl(null, Validators.required);
    this.loss_type = new FormControl(null, Validators.required);
    this.cause_id = new FormControl(null, Validators.required);
  }
  createUPDTdefinitionForm() {
    this.updtdefinitionform = new FormGroup({
      _id: this._id,
      start_time: this.start_time,
      end_time: this.end_time,
      loss_type: this.loss_type,
      cause_id: this.cause_id,
    });
  }

  ngOnInit() {

    this.losstypes = this.data.dataKey.losstypes;

    //ADD
    if (this.data.dataKey.rowdata === "") {
      this.createFormControlsUPDTdefinition();
      this.createUPDTdefinitionForm();
    }
    //Update
    else {
      this.causetypes = this.data.dataKey.causetypes;
      this.updateRow(this.data.dataKey.rowdata);
      this.createUPDTdefinitionForm();
      this._id = this.data.dataKey.rowdata.updtDefinitionId;
      this.start_time = this.data.dataKey.rowdata.starttime;
      this.end_time = this.data.dataKey.rowdata.endtime;
      this.loss_type = this.data.dataKey.rowdata.losstypeid;
      this.cause_id = this.data.dataKey.rowdata.causeid;
      this.todaydate = new Date(this.data.dataKey.rowdata.starttime);
      //this.updateRow(this.data.dataKey.rowdata);
    }
  }

  updateRow(element) {

    this._id = new FormControl(element.updtDefinitionId);
    this.start_time = new FormControl(new Date(element.starttime), Validators.required);
    this.end_time = new FormControl(new Date(element.endtime), Validators.required);
    this.loss_type = new FormControl(element.losstypeid, Validators.required);
    this.cause_id = new FormControl(element.causeid, Validators.required);

    // this.updtdefinitionform.patchValue({
    //   _id: element.updtDefinitionId,
    //   start_time: element.starttime,
    //   end_time: element.endtime,
    //   loss_type: element.losstypeid,
    //   cause_id: element.causeid
    // });
  }

  close() {
    this.dialogRef.close();
  }

  SendLossCategoryToDailog(losstype) {
    this.causetypes = [];
    this.dataentryservice.GetServerAPIPath().subscribe(serverdetails => {
      this.dataentryservice.GetLossData(serverdetails['line_id'], losstype.split('/')[1], serverdetails['server']).subscribe((Losscategorydata: any[]) => {
        for (let i = 0; i < Losscategorydata.length; i++) {
          const c = Losscategorydata[i];
          let a: string[] = [''];
          a.push(c._id);
          a.push(c.value);
          a.push(c.display_name);
          this.causetypes.push(a);
        }
      });
    });
    return this.causetypes;
  }
}
