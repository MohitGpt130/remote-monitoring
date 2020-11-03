import { ManualEntryService } from './../../../manual-entry.service';

import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-formatdailog',
  templateUrl: './formatdailog.component.html',
  styleUrls: ['./formatdailog.component.scss']
})
export class FormatdailogComponent implements OnInit {
  Formatform: FormGroup;
  _id: FormControl;
  format_name: FormControl;
  format_code: FormControl;
  blister_per_format: FormControl;
  tablet_per_blister: FormControl;
  rated_speed: FormControl;
  machine_speed: FormControl;
  lineid;
  title;
  button;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<FormatdailogComponent>,
    private httpClient: HttpClient, private _snackBar: MatSnackBar, protected dataentryservice: ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormatcause() {
    this._id = new FormControl(null);
    this.format_name = new FormControl(null);
    this.format_code = new FormControl(null, Validators.required);
    this.blister_per_format = new FormControl(null);
    this.tablet_per_blister = new FormControl(null, Validators.required);

    this.machine_speed = new FormControl(null, Validators.required);
    this.rated_speed = new FormControl(null, Validators.required);
    //this.line_id = new FormControl(null, Validators.required);

  }
  createFormatcauseform() {
    this.Formatform = new FormGroup({
      _id: this._id,
      format_name: this.format_name,
      format_code: this.format_code,
      blister_per_format: this.blister_per_format,
      tablet_per_blister: this.tablet_per_blister,
      rated_speed: this.rated_speed,
      machine_speed: this.machine_speed
      //line_id: this.line_id,
    });
  }

  ngOnInit() {
    console.log(this.data.dataKey.rowdata);
    if (this.data.dataKey.hasOwnProperty('rowdata')) {
      console.log("True");
      this.updateRow(this.data.dataKey.rowdata);
      console.log("show");
      this.createFormatcauseform();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      console.log("empty" + this.data.dataKey.title);
      // this.GlobalKeys = this.data.dataKey.globalKeys
      this.lineid = this.data.dataKey.lineid;
      //console.log("hi "+this.data.dataKey.globalKeys);
      //this.updateRow(this.data.datakey.rowdata);

    }
    else {
      this.createFormatcause();
      this.createFormatcauseform();
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
    this._id = new FormControl(element.Formatid);
    this.format_name = new FormControl(element.Formatname);
    this.format_code = new FormControl(element.Formatcode, Validators.required);
    this.blister_per_format = new FormControl(element.Formatblisterperformat, Validators.required);
    this.tablet_per_blister = new FormControl(element.Formattableperblister, Validators.required);
    this.rated_speed = new FormControl(element.Formatratedspeed, Validators.required);
    this.machine_speed = new FormControl(element.Formatmachinespeed, Validators.required);
  }
  close() {
    this.dialogRef.close();
  }

  BindRatedSpeedFrom(Blisterperformat) {
    console.log('Test calculateratedspeed' + Blisterperformat);
    if (Blisterperformat != "" && this.machine_speed.value != "")
      this.rated_speed.setValue(this.CalculateRatedSpeed(Blisterperformat, this.machine_speed.value));
  }
  BindRatedSpeed(machinespeed) {
    if (machinespeed != "" && this.blister_per_format.value != "")
    this.rated_speed.setValue(this.CalculateRatedSpeed(this.blister_per_format.value, machinespeed));
  }

  CalculateRatedSpeed(Blisterperformat, MachineSpeed) {
    return parseInt(Blisterperformat) * parseInt(MachineSpeed);
  }

}
