import { ManualEntryService } from './../../manual-entry.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
interface Shifts {
  shiftid: string;
  shiftname: string;
}
@Component({
  selector: 'app-rejectrework',
  templateUrl: './rejectrework.component.html',
  styleUrls: ['./rejectrework.component.scss']
})

export class RejectreworkComponent implements OnInit {
  rejectreworkform: FormGroup;

  Shifts = [];
  machine_data;
  constructor(private formBuilder: FormBuilder, protected dataSourceService: ManualEntryService,
    public dialogRef: MatDialogRef<RejectreworkComponent>,
    private snackBar: MatSnackBar,
    public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    var D = this.datePipe.transform(this.data.dataKey.Shiftdate, 'yyyy-MM-dd');
    var shiftname = this.data.dataKey.Shiftname;
    //var Lineid = "5e54a412ddf58e3866836970",
    this.rejectreworkform = this.formBuilder.group({
      shift_name: [this.data.dataKey.Shiftname, Validators.required],
      date: [D, Validators.required],
      line_id: "",
      data: new FormArray([])
    });

    this.BuildFormFields(D, shiftname);
    //this.GetShiftData();
  }
  get f() { return this.rejectreworkform.controls; }
  get t() { return this.f.data as FormArray; }

  BuildFormFields(ShiftDate, Shiftname) {
    if (ShiftDate === "") {
      ShiftDate = this.datePipe.transform(this.data.dataKey.Shiftdate, 'yyyy-MM-dd');
    }
    this.dataSourceService.GetServerAPIPath().subscribe(apipath => {
      if (apipath['server'] !== undefined) {

        this.dataSourceService.GetPreviousShift(apipath['server']).subscribe((shiftdetails) => {
          var d1 = moment(new Date(this.dataSourceService.ConvertToLocalTimezone(new Date(shiftdetails['current_shift'].current_timeStamp))), 'HH:mm:ss');
          // + new Date(shiftdetails['current_shift'].shiftStartTime).getTime());// - new Date(shiftdetails['current_shift'].current_timeStamp.shiftStartTime));
          var d2 = moment(new Date(shiftdetails['current_shift'].shiftStartTime), 'HH:mm:ss');
          if (d1.diff(d2, 'minutes') >= 60) {
            ShiftDate = this.datePipe.transform(new Date(shiftdetails['current_shift'].shiftStartTime), 'yyyy-MM-dd');
            Shiftname = shiftdetails['current_shift'].shift;
          }
          else {
            ShiftDate = this.datePipe.transform(new Date(shiftdetails['pre_shift'].shiftStartTime), 'yyyy-MM-dd');
            Shiftname = shiftdetails['pre_shift'].shift;
          }
          //this.rejectreworkform
          this.rejectreworkform.controls['shift_name'].setValue(Shiftname);
          this.rejectreworkform.controls['date'].setValue(ShiftDate);

          this.dataSourceService.GetRejectReworkDetails(apipath['server'], ShiftDate, apipath['line_id'], Shiftname).subscribe(
            (machine_data: any) => {
              for (let i = 0; i < machine_data.data.length; i++) {

                this.t.push(this.formBuilder.group({
                  machine_name: [machine_data.data[i]['machine_name']],
                  display_name: [{ value: machine_data.data[i]['display_name'], disabled: true }],
                  reject: [{ value: machine_data.data[i]['reject'], disabled: true }],
                  rework: [{ value: machine_data.data[i]['rework'], disabled: true }],
                  manual_rework: [machine_data.data[i]['manual_rework'], [Validators.required]],
                  manual_reject: [machine_data.data[i]['manual_reject'], [Validators.required]]
                }));
              }
            });
        });
      }
    });
  }

  onSubmit() {
  }

  PostRejectReworkForm() {
    this.dataSourceService.GetServerAPIPath().subscribe(apipath => {
      if (apipath['server'] !== undefined) {
        this.dataSourceService.GetPreviousShift(apipath['server']).subscribe((shiftdetails) => {
          var d1 = moment(new Date(this.dataSourceService.ConvertToLocalTimezone(new Date(shiftdetails['current_shift'].current_timeStamp))), 'HH:mm:ss');
          // + new Date(shiftdetails['current_shift'].shiftStartTime).getTime());// - new Date(shiftdetails['current_shift'].current_timeStamp.shiftStartTime));
          var d2 = moment(new Date(shiftdetails['current_shift'].shiftStartTime), 'HH:mm:ss');
          if (d1.diff(d2, 'minutes') >= 0 && d1.diff(d2, 'minutes') <= 60) {
            this.dataSourceService.PostRejectReworkData(apipath['server'], this.rejectreworkform.value).subscribe(
              (data: any[]) => {
                this.openSnackBar("Success", "Data saved Successfully");
              },
              (error: HttpErrorResponse) => {
                if (error.status == 409) {
                  this.openSnackBar("Validation", error.error);
                }
                else {
                  this.openSnackBar("Error", error.error);
                }
              }
            );
          }
          else {
            this.openSnackBar("Not Submitted", "Note: Data can be only submitted only 1 Hour after Shift end.");
          }
        });
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  close() {
    this.dialogRef.close();
  }

}
