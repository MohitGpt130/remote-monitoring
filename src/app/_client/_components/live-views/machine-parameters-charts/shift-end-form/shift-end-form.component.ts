import { ManualEntryService } from './../../../manual-entry.service';;
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-shift-end-form',
  templateUrl: './shift-end-form.component.html',
  styleUrls: ['./shift-end-form.component.scss']
})
export class ShiftEndFormComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private httpClient: HttpClient, public datepipe: DatePipe,
    protected dataSourceService: ManualEntryService, public dialogRef: MatDialogRef<ShiftEndFormComponent>,
    private snackBar: MatSnackBar,
  ) {
    //this.getShiftEndData();
  }
  //Shifts:["Shift A","Shift B"]
  Shifts: string[];//= ['Shift A', 'Shift B'];
  Machines: string[]; allmachines;
  vdisplayedColumns: string[];
  filledForm: boolean = false;
  filledData;
  ShiftEndComments = [
    {
      user_name: '',
      comment: '',
      comment_date: '',
      shift_name: '',
      created_date: ''
    },
  ];
  //-------------Form Group and controls--------------------
  shift_end_form: FormGroup;

  user_name: FormControl;
  shift_name: FormControl;
  comment_date: FormControl;
  comment: FormControl;
  createFormControlsShiftEndForm() {
    this.user_name = new FormControl('', Validators.required);
    this.shift_name = new FormControl('', Validators.required);
    this.comment_date = new FormControl('', Validators.required);
    this.comment = new FormControl('', Validators.required);
  }

  createShiftEndForm() {
    this.shift_end_form = new FormGroup({
      user_name: this.user_name,
      shift_name: this.shift_name,
      comment_date: this.comment_date,
      comment: this.comment
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  ngOnInit() {
    this.createFormControlsShiftEndForm();
    this.createShiftEndForm();
    this.getShiftEndData('', '');
  }

  getShiftEndData(ShiftDate, Shiftname) {
    this.dataSourceService.GetServerAPIPath().subscribe(apipath => {
      if (apipath['server'] !== undefined) {
        this.dataSourceService.GetPreviousShift(apipath['server']).subscribe((shiftdetails) => {
          var d1 = moment(new Date(this.dataSourceService.ConvertToLocalTimezone(new Date(shiftdetails['current_shift'].current_timeStamp))), 'HH:mm:ss');
          // + new Date(shiftdetails['current_shift'].shiftStartTime).getTime());// - new Date(shiftdetails['current_shift'].current_timeStamp.shiftStartTime));
          var d2 = moment(new Date(shiftdetails['current_shift'].shiftStartTime), 'HH:mm:ss');
          if (d1.diff(d2, 'minutes') >= 60) {
            ShiftDate = this.datepipe.transform(new Date(shiftdetails['current_shift'].shiftStartTime), 'yyyy-MM-dd');
            Shiftname = shiftdetails['current_shift'].shift;
          }
          else {
            ShiftDate = this.datepipe.transform(new Date(shiftdetails['pre_shift'].shiftStartTime), 'yyyy-MM-dd');
            Shiftname = shiftdetails['pre_shift'].shift;
          }
          this.shift_name.setValue(Shiftname);
          this.comment_date.setValue(ShiftDate);

          this.httpClient.get(apipath['server'] + '/api/manual/shiftcomment?shift_name=Shift%20B&limit=5').subscribe(
            (data: any[]) => {

              var aData: any = data;
              if (!Object.keys(data).length)
                this.filledForm = false;
              else
                this.filledForm = true;
              this.filledData = data;
              if (this.filledForm) {

                this.ShiftEndComments = [];
                for (let i = 0; i < this.filledData.length; i++) {
                  this.ShiftEndComments.push({
                    user_name: this.filledData[i]["user_name"],
                    comment: this.filledData[i]["comment"],
                    comment_date: this.datepipe.transform(this.filledData[i]["comment_date"], 'yyyy-MM-dd'),
                    shift_name: this.filledData[i]["shift_name"],
                    created_date: this.filledData[i]["created_date"]
                  });
                }
              }
            });


        });
      }
    });
  }

  postShiftEndData() {
    this.dataSourceService.GetServerAPIPath().subscribe(apipath => {
      if (apipath['server'] !== undefined) {
        this.dataSourceService.GetPreviousShift(apipath['server']).subscribe((shiftdetails) => {
          var d1 = moment(new Date(this.dataSourceService.ConvertToLocalTimezone(new Date(shiftdetails['current_shift'].current_timeStamp))), 'HH:mm:ss');
          // + new Date(shiftdetails['current_shift'].shiftStartTime).getTime());// - new Date(shiftdetails['current_shift'].current_timeStamp.shiftStartTime));
          var d2 = moment(new Date(shiftdetails['current_shift'].shiftStartTime), 'HH:mm:ss');
          if (d1.diff(d2, 'minutes') >= 0 && d1.diff(d2, 'minutes') <= 60) {
            if (this.shift_end_form.valid) {
              this.comment_date.setValue(this.datepipe.transform(this.comment_date.value, 'yyyy-MM-dd'));
              this.httpClient.post(apipath['server'] + '/api/manual/shiftcomment', this.shift_end_form.value).subscribe(
                (data: any[]) => {
                  this.shift_end_form.reset();
                  this.getShiftEndData('', '');
                }
              )
            }
          }
          else {
            this.openSnackBar("Not Submitted", "Note: Data can be only submitted only 1 Hour after Shift end.");
          }
        });
      }
    });
  }

  date(date: any, arg1: string): FormControl {
    throw new Error("Method not implemented.");
  }

  getAge(birthDate, ageAtDate = null) {

    var daysInMonth = 30.436875; // Days in a month on average.
    var dob = new Date(birthDate);
    var aad;
    if (!ageAtDate) aad = new Date();
    else aad = new Date(ageAtDate);
    var yearAad = aad.getFullYear();
    var yearDob = dob.getFullYear();
    var years = yearAad - yearDob; // Get age in years.
    dob.setFullYear(yearAad); // Set birthday for this year.
    var aadMillis = aad.getTime();
    var dobMillis = dob.getTime();
    if (aadMillis < dobMillis) {
      --years;
      dob.setFullYear(yearAad - 1); // Set to previous year's birthday
      dobMillis = dob.getTime();
    }

    var days, hours, minutes, seconds;
    seconds = (Math.floor((aadMillis - dobMillis) / 1000) % 60);
    minutes = (Math.floor((aadMillis - dobMillis) / 60000) % 60);
    hours = (Math.floor((aadMillis - dobMillis) / 3600000) % 24);
    days = Math.floor((aadMillis - dobMillis) / 86400000);
    var monthsDec = days / daysInMonth; // Months with remainder.
    var months = Math.floor(monthsDec); // Remove fraction from month.

    days = Math.floor(daysInMonth * (monthsDec - months));
    var ago = ''
    if (years !== 0)
      ago = years + ' years ago'
    else if (months !== 0)
      ago = months + ' months ago'
    else if (days !== 0)
      ago = days + ' days ago'
    else if (hours !== 0)
      ago = hours + ' hours ago'
    else if (minutes !== 0)
      ago = minutes + ' minutes ago'
    else if (seconds !== 0)
      ago = seconds + ' seconds ago'

    return { years: years, months: months, days: days, hours: hours, minutes: minutes, seconds: seconds, ago: ago };
  }

  close() {
    this.dialogRef.close();
  }
}
