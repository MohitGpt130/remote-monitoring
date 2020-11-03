import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-globalkeydailog',
  templateUrl: './globalkeydailog.component.html',
  styleUrls: ['./globalkeydailog.component.scss']
})
export class GlobalkeydailogComponent implements OnInit {

  globalkeyform: FormGroup;

  _id: FormControl;
  value: FormControl;
  display_name: FormControl;
  title;
  button;
  lineid;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<GlobalkeydailogComponent>, private httpClient: HttpClient, private _snackBar: MatSnackBar) {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  createFormControlsFaultCause() {
    this._id = new FormControl(null);
    this.value = new FormControl(null, Validators.required);
    this.display_name = new FormControl(null, Validators.required);
  }

  createFaultCauseForm() {
    this.globalkeyform = new FormGroup({
      _id: this._id,
      value: this.value,
      display_name: this.display_name,
    });
  }


  ngOnInit() {
    console.log("on dialog"+this.data.dataKey.rowdata);
    if (this.data.dataKey.hasOwnProperty('rowdata')) {
      console.log("True");
      console.log(this.data.dataKey.rowdata);
      this.updateRow(this.data.dataKey.rowdata);
      this.createFaultCauseForm();
      //this.updateRow(this.data.datakey.rowdata);
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      this.lineid = this.data.dataKey.lineid;
    }
    else {
      this.createFormControlsFaultCause();
      this.createFaultCauseForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      this.lineid = this.data.dataKey.lineid;
    }
  }

  updateRow(element) {
    console.log("Sahi hai");
    this._id = new FormControl(element.globalKeyid);
    this.value = new FormControl(element.globalKeyvalue, Validators.required);
    this.display_name = new FormControl(element.globalKeyDisplayname, Validators.required);
  }

  close() {
    this.dialogRef.close();
  }

  SubmitChanges() {
    console.log("I have reached function");
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          var T = {};
          //console.log(this._id.value);
          if (this._id.value !== null || this._id.value !== "") {
            T = {
              _id: this._id.value === "" ? null : this._id.value,
              type: 'globalkey',
              value: this.value.value,
              display_name: this.display_name.value,
              line_id: this.lineid
            }
          }
          else {
            console.log("Posting");
            T = {
              _id: null,
              type: 'globalkey',
              value: this.value.value,
              display_name: this.display_name.value,
              line_id: this.lineid
            }
          }

          console.log("Data which is being posted : " + JSON.stringify(T));
          //console.log(T);
          //console.log(apipath['server']);
          this.httpClient.post(apipath['server'] + '/api/type', T).subscribe(
            (data: any[]) => {

              //this.openSnackBar("Success", "Records Added Successfully");
              //console.log("Data:-> "+JSON.stringify(data));
              this.dialogRef.close({ event: 'close', data: data });
              this.globalkeyform.reset();
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
