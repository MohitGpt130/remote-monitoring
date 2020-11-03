import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-globaltypedailog',
  templateUrl: './globaltypedailog.component.html',
  styleUrls: ['./globaltypedailog.component.scss']
})
export class GlobaltypedailogComponent implements OnInit {

  globaltypemasterform: FormGroup;

  _id: FormControl;
  type: FormControl;
  value: FormControl;
  display_name: FormControl;

  lineid;
  title;
  button;
  GlobalKeys;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<GlobaltypedailogComponent>, private httpClient: HttpClient, private _snackBar: MatSnackBar) {

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

  }

  createFaultCauseForm() {
    this.globaltypemasterform = new FormGroup({
      _id: this._id,
      type: this.type,
      value: this.value,
      display_name: this.display_name,
    });
  }

  ngOnInit() {
    //console.log(this.data.dataKey.rowdata);
    if (this.data.dataKey.hasOwnProperty('rowdata')) {
      console.log("True");
      this.updateRow(this.data.dataKey.rowdata);
      this.createFaultCauseForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      this.GlobalKeys = this.data.dataKey.globalKeys
      this.lineid = this.data.dataKey.lineid;
      //console.log("hi "+this.data.dataKey.globalKeys);
      //this.updateRow(this.data.datakey.rowdata);
    }
    else {
      this.createFormControlsFaultCause();
      this.createFaultCauseForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      console.log(this.data.dataKey.globalKeys);
      console.log(this.data.dataKey.globalKeys);
      this.GlobalKeys = this.data.dataKey.globalKeys;
      this.lineid = this.data.dataKey.lineid;
    }

  }

  updateRow(element) {
    //console.log("element updaterow: "+element);
    this._id = new FormControl(element.globalTypeid);
    this.type = new FormControl(element.globalTypename, Validators.required);
    this.value = new FormControl(element.globalTypevalue, Validators.required);
    this.display_name = new FormControl(element.globalTypeDisplayname, Validators.required);
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
          if (this._id.value !== null) {
            T = {
              _id: this._id.value,
              value: this.value.value,
              type: this.type.value,
              display_name: this.display_name.value,
              line_id: this.lineid,//replaced apipath['line_id'] with 5e54a412ddf58e3866836970
            }
          }
          else {
            console.log("present");
            T = {
              //_id: null,
              value: this.value.value,
              type: this.type.value,
              display_name: this.display_name.value,
              line_id: this.lineid,//replaced apipath['line_id'] with 5e54a412ddf58e3866836970
              //  state:this.state.value,
              //  another_language_name: this.another_language_name.value
            }
          }

          console.log("Data which is being posted : " + JSON.stringify(T));
          console.log(apipath['server']);
          this.httpClient.post(apipath['server'] + '/api/type', T).subscribe(
            (data: any[]) => {
              console.log(data);
              this.dialogRef.close({ event: 'close', data: data });
              this.globaltypemasterform.reset();
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
