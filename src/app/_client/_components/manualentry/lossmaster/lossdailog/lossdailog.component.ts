import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lossdailog',
  templateUrl: './lossdailog.component.html',
  styleUrls: ['./lossdailog.component.scss']
})
export class LossdailogComponent implements OnInit {

  lossmasterform: FormGroup;

  _id: FormControl;
  type: FormControl;
  value: FormControl;
  display_name: FormControl;
  state: FormControl;
  another_language_name: FormControl;
  LossTypes;
  stateofMachine;
  title;
  button;
  lineid;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<LossdailogComponent>, private httpClient: HttpClient, private _snackBar: MatSnackBar) {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormControlsFaultCause() {
    this._id = new FormControl(null);
    this.type = new FormControl(null, Validators.required);
    this.value = new FormControl(null, Validators.required);
    this.display_name = new FormControl(null, Validators.required);
    this.state = new FormControl(null, Validators.required);
    this.another_language_name = new FormControl(null, Validators.required)
  }

  createFaultCauseForm() {
    this.lossmasterform = new FormGroup({
      _id: this._id,
      type: this.type,
      value: this.value,
      display_name: this.display_name,
      state: this.state,
      another_language_name: this.another_language_name
    });
  }

  ngOnInit() {
    console.log(this.data.dataKey.rowdata);
    if (this.data.dataKey.hasOwnProperty('rowdata')) {
      console.log("True");
      this.updateRow(this.data.dataKey.rowdata);
      console.log("show");
      this.createFaultCauseForm();
      //console.log(this.data.dataKey.losstypes);
      this.LossTypes = this.data.dataKey.losstypes;
      // console.log(this.data.dataKey.stateofMachine);
      this.stateofMachine = this.data.dataKey.stateofMachine;
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      this.lineid = this.data.dataKey.lineid;
      this.updateRow(this.data.dataKey.rowdata);
    }
    else {
      this.createFormControlsFaultCause();
      this.createFaultCauseForm();
      //console.log(this.data.dataKey.losstypes);
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      console.log("1");
      this.lineid = this.data.dataKey.lineid;
      console.log("2");
      this.LossTypes = this.data.dataKey.losstypes;
      // console.log(this.data.dataKey.stateofMachine);
      this.stateofMachine = this.data.dataKey.stateofMachine;
    }
  }

  updateRow(element) {
    console.log(element);
    this._id = new FormControl(element.lossId);
    this.type = new FormControl(element.lossType, Validators.required);
    this.value = new FormControl(element.lossValue, Validators.required);
    this.display_name = new FormControl(element.lossDisplayname, Validators.required);
    this.state = new FormControl(element.lossState, Validators.required);
    this.another_language_name = new FormControl(element.lossLang, Validators.required);
  }

  close() {
    this.dialogRef.close();
  }
  SubmitChanges(result){
    console.log("I have reached function");
  }

}
