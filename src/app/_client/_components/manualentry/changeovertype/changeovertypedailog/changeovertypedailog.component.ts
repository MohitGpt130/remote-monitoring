import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ManualEntryService } from '../../../manual-entry.service';

@Component({
  selector: 'app-changeovertypedailog',
  templateUrl: './changeovertypedailog.component.html',
  styleUrls: ['./changeovertypedailog.component.scss'],
})
export class ChangeovertypedailogComponent implements OnInit {
  changeoverform: FormGroup;
  _id: FormControl;
  changeover_type: FormControl;
  changeover_name: FormControl;
  standard_duration: FormControl;
  lineid;
  title;
  button;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangeovertypedailogComponent>,
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    protected dataentryservice: ManualEntryService
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createchangeoverCause() {
    this._id = new FormControl(null);
    this.changeover_type = new FormControl(null, Validators.required);
    this.changeover_name = new FormControl(null, Validators.required);
    this.standard_duration = new FormControl(null, Validators.required);
  }
  createchangeoverForm() {
    this.changeoverform = new FormGroup({
      _id: this._id,
      changeover_type: this.changeover_type,
      changeover_name: this.changeover_name,
      standard_duration: this.standard_duration,
    });
  }

  ngOnInit() {
    if (this.data.dataKey.hasOwnProperty('rowdata')) {
      this.updateRow(this.data.dataKey.rowdata);
      this.createchangeoverForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      // this.GlobalKeys = this.data.dataKey.globalKeys
      this.lineid = this.data.dataKey.lineid;
      //this.updateRow(this.data.datakey.rowdata);
    } else {
      this.createchangeoverCause();
      this.createchangeoverForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      //this.GlobalKeys = this.data.dataKey.globalKeys;
      this.lineid = this.data.dataKey.lineid;
    }
  }
  updateRow(element) {
    this._id = new FormControl(element.changeoverid);
    this.changeover_type = new FormControl(
      element.changeovertype,
      Validators.required
    );
    this.changeover_name = new FormControl(
      element.changeovername,
      Validators.required
    );
    this.standard_duration = new FormControl(
      element.changeoverduration,
      Validators.required
    );
  }
  close() {
    this.dialogRef.close();
  }
}
