import { ManualEntryService } from './../../../manual-entry.service';;
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-operatordailogentry',
  templateUrl: './operatordailogentry.component.html',
  styleUrls: ['./operatordailogentry.component.scss']
})
export class OperatordailogentryComponent implements OnInit {

  operatorEntryform: FormGroup;
  _id: FormControl;
  operator_name: FormControl;
  display_name: FormControl;
  code: FormControl;
  origin: FormControl;
  lineid;
  title;
  button;
  // GlobalKeys;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<OperatordailogentryComponent>,
    private httpClient: HttpClient, private _snackBar: MatSnackBar, protected dataentryservice: ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  createFormControlsFaultCause() {
    this._id = new FormControl(null);
    this.operator_name = new FormControl(null, Validators.required);
    this.display_name = new FormControl(null);
    this.code = new FormControl(null, Validators.required);
    this.origin = new FormControl(null, Validators.required);

  }
  createFaultCauseForm() {
    this.operatorEntryform = new FormGroup({
      _id: this._id,
      operator_name: this.operator_name,
      display_name: this.display_name,
      code: this.code,
      origin: this.origin,
    });
  }
  ngOnInit() {
    console.log(this.data.dataKey.rowdata);
    if (this.data.dataKey.hasOwnProperty('rowdata')) {
      console.log("True");
      this.updateRow(this.data.dataKey.rowdata);
      console.log("show");
      this.createFaultCauseForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      console.log("empty" + this.data.dataKey.title);
      // this.GlobalKeys = this.data.dataKey.globalKeys
      this.lineid = this.data.dataKey.lineid;
      //console.log("hi "+this.data.dataKey.globalKeys);
      //this.updateRow(this.data.datakey.rowdata);
    }
    else {
      this.createFormControlsFaultCause();
      this.createFaultCauseForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      //console.log(this.data.dataKey.globalKeys);
      //this.GlobalKeys = this.data.dataKey.globalKeys;
      this.lineid = this.data.dataKey.lineid;
      console.log("else" + this.data.dataKey.title);
    }

  }
  updateRow(element) {
    //console.log("element updaterow: " + element);
    this._id = new FormControl(element.operatorEntryid);
    this.operator_name = new FormControl(element.operatorEntryname, Validators.required);
    this.display_name = new FormControl(element.operatorEntrydisplayName, Validators.required);
    this.code = new FormControl(element.operatorEntrycode, Validators.required);
    this.origin = new FormControl(element.operatorEntryorigin, Validators.required);
  }
  close() {
    this.dialogRef.close();
  }
 /* SubmitChanges() {
    //console.log("I have reached function");
    var T = {};
    if (this._id.value !== null) {
      T = {
        _id: this._id.value,
        operator_name: this.operator_name.value,
        display_name: this.display_name.value,
        code: this.code.value,
        origin: this.origin.value
      }
    }
    else {
      console.log("present");
      T = {
        _id: null,
        operator_name: this.operator_name.value,
        display_name: this.display_name.value,
        code: this.code.value,
        origin: this.origin.value
      }
    }
    console.log("Data which is being posted : " + JSON.stringify(T));

    this.dataentryservice.GetServerAPIPath().subscribe(apipath => {
      this.dataentryservice.PostOperatorData(apipath['server'], T).subscribe(
        (data: any[]) => {
          console.log(data);
          this.dialogRef.close({ event: 'close', data: data });
          this.operatorEntryform.reset();
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
    });
  } */
}
