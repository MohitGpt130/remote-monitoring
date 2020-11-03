import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManualEntryService } from '../../../manual-entry.service';

@Component({
  selector: 'app-fgexdailog',
  templateUrl: './fgexdailog.component.html',
  styleUrls: ['./fgexdailog.component.scss']
})
export class FgexdailogComponent implements OnInit {
  Fgexform: FormGroup;
  _id: FormControl;
  fgex: FormControl;
  product_name: FormControl;
  halb_code: FormControl;
  pack: FormControl;
  type: FormControl;
  layout_no: FormControl;
  blister_size: FormControl;
  current_machine: FormControl;
  blister_per_format: FormControl;
  machine_cycle: FormControl;
  rated_speed: FormControl;
  display_name: FormControl;
  tablet_per_blister: FormControl;

  title;
  button;
  lineid;
  GlobalKeys;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<FgexdailogComponent>,
  private httpClient: HttpClient, private _snackBar: MatSnackBar, protected dataentryservice: ManualEntryService) { }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFgexcause() {
    this._id = new FormControl(null);
    this.fgex = new FormControl(null);
    this.product_name = new FormControl(null, Validators.required);
    this.halb_code = new FormControl(null);
    this.pack = new FormControl(null);
    this.type = new FormControl(null);
   // this.type = new FormControl(null);
    this.layout_no = new FormControl(null);
    this.blister_size = new FormControl(null);
    this.current_machine = new FormControl(null);
    this.blister_per_format = new FormControl(null, Validators.required);
    this.machine_cycle = new FormControl(null, Validators.required);
    this.tablet_per_blister = new FormControl(null);
    this.rated_speed = new FormControl(null, Validators.required);
    //this.line_id = new FormControl(null, Validators.required);

  }

  createFgexcauseform() {
    this.Fgexform = new FormGroup({
      _id: this._id,
      fgex: this.fgex,
      product_name: this.product_name,
      halb_code: this.halb_code,
      pack: this.pack,
      type: this.type,
      layout_no: this.layout_no,
      blister_size: this.blister_size,
      current_machine: this.current_machine,
      blister_per_format: this.blister_per_format,
      machine_cycle: this.machine_cycle,
      tablet_per_blister :this.tablet_per_blister,
      rated_speed: this.rated_speed,
      //line_id: this.line_id,
    });
  }
  ngOnInit() {
    console.log(this.data.dataKey.rowdata);
    if (this.data.dataKey.hasOwnProperty('rowdata')) {
      console.log("True");
      this.updateRow(this.data.dataKey.rowdata);
      console.log("show");
      this.createFgexcauseform();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      console.log("empty" + this.data.dataKey.title);
      this.lineid = this.data.dataKey.lineid;
       this.GlobalKeys = this.data.dataKey.globalKeys
      //this.lineid = this.data.dataKey.lineid;
      //console.log("hi "+this.data.dataKey.globalKeys);
      //this.updateRow(this.data.datakey.rowdata)
  }

else {
  this.createFgexcause();
  this.createFgexcauseform();
  this.title = this.data.dataKey.title;
  this.button = this.data.dataKey.button;
  //console.log(this.data.dataKey.globalKeys);
  this.GlobalKeys = this.data.dataKey.globalKeys;
  this.lineid = this.data.dataKey.lineid;
  console.log("else" + this.data.dataKey.title);
  }
  }

  updateRow(element) {
    //console.log("element updaterow: " + element);
    this._id = new FormControl(element.Fgexid);
    this.fgex = new FormControl(element.Fgexno);
    this.product_name = new FormControl(element.Fgexproductname, Validators.required);
    this.halb_code = new FormControl(element.Fgexhalbcode);
    this.pack = new FormControl(element.Fgexpack);
    this.type = new FormControl(element.FgextypeId);
    this.layout_no = new FormControl(element.Fgexlayout);
    this.blister_size = new FormControl(element.Fgexblistersize);
    this.current_machine = new FormControl(element.Fgexcurrentmachine);
    this.blister_per_format = new FormControl(element.Fgexblisterperformat, Validators.required);
    this.machine_cycle = new FormControl(element.Fgexcycle, Validators.required);

    this.tablet_per_blister = new FormControl(element.Fgextablet);
     this.rated_speed = new FormControl(element.Fgexratedspeed, Validators.required);
  }
  close() {
    this.dialogRef.close();
  }
  BindRatedSpeedFrom(Blisterperformat) {
    console.log('Test calculateratedspeed' + Blisterperformat);
    if (Blisterperformat != "" && this.machine_cycle.value != "")
      this.rated_speed.setValue(this.CalculateRatedSpeed(Blisterperformat, this.machine_cycle.value));
  }
  BindRatedSpeed(machinecycle) {
    if (machinecycle != "" && this.blister_per_format.value != "")
    this.rated_speed.setValue(this.CalculateRatedSpeed(this.blister_per_format.value, machinecycle));
  }

  CalculateRatedSpeed(Blisterperformat, machinecycle) {
    return parseInt(Blisterperformat) * parseInt(machinecycle);
  }



}
