import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { appDataService } from "../../app-data.service";
import { validateBasis } from '@angular/flex-layout';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-reject-quantity-form',
  templateUrl: './reject-quantity-form.component.html',
  styleUrls: ['./reject-quantity-form.component.scss'],
})
export class RejectQuantityFormComponent implements OnInit {
  headerInfo;
  sub: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClient: HttpClient,
    public datepipe: DatePipe,
    private appDataService: DataService
  ) {
    //this.getShiftEndData();
  }

  //Shifts:["Shift A","Shift B"]
  Shifts: string[] = ['Shift A', 'Shift B'];
  Machines: string[];
  allmachines;
  vdisplayedColumns: string[];
  //filledForm: boolean = false;
  filledData;
  rejectCount;
  RejectComments = [
    {
      //user_name: '',
      machine_name: '',
      machine_text: '',
      reject_quantity: '',
      shift_date: '',
      shift_name: '',
      created_date: '',
      comments: [],
    },
  ];
  //-------------Form Group and controls--------------------
  reject_quantity_form: FormGroup;

  user_name: FormControl;
  shift_name: FormControl;
  shift_date: FormControl;
  machine_name: FormControl;
  reject_quantity: FormControl;
  comment: FormControl;

  createFormControlsShiftEndForm() {
    this.user_name = new FormControl('', Validators.required);
    this.shift_name = new FormControl('', Validators.required);
    this.shift_date = new FormControl('', Validators.required);
    this.machine_name = new FormControl('', Validators.required);
    this.reject_quantity = new FormControl('', Validators.required);
    this.comment = new FormControl('', Validators.required);
  }

  createShiftEndForm() {
    this.reject_quantity_form = new FormGroup({
      user_name: this.user_name,
      shift_name: this.shift_name,
      shift_date: this.shift_date,
      machine_name: this.machine_name,
      reject_quantity: this.reject_quantity,
      comment: this.comment,
    });
  }

  ngOnInit() {

    this.createFormControlsShiftEndForm();
    this.createShiftEndForm();

    this.shift_name.setValue(this.data.dataKey.Shiftname);
    this.shift_date.setValue(
      this.datepipe.transform(this.data.dataKey.Shiftdate, 'yyyy-MM-dd')
    );

    this.getShiftEndData();
  }

  filterByMachine() {
    if (this.machine_name.value != null) {
      for (let i = 0; i < Object.keys(this.RejectComments).length; i++) {
        if (
          this.RejectComments[i]['machine_name'] === this.machine_name.value
        ) {
          this.reject_quantity.setValue(
            this.RejectComments[i]['reject_quantity']
          );
          break;
        } else {
          this.reject_quantity.setValue('');
        }
      }
    } else {
      this.reject_quantity.setValue(null);
    }
  }

  getShiftEndData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe((apipath) => {
      this.Shifts = Object.keys(apipath['shift_timings']);
      if (apipath['server'] !== undefined) {
        this.Machines = Object.keys(apipath['machines']);
        this.allmachines = apipath['machines'];
        this.httpClient
          .get(
            apipath['server'] +
              '/api/manual/qualityreject?shift_name=' +
              this.shift_name.value +
              '&shift_date=' +
              this.datepipe.transform(
                this.shift_date.value == null || undefined
                  ? 'aaj ka date'
                  : this.shift_date.value,
                'yyyy-MM-dd'
              ) +
              ''
          )
          .subscribe(
            (data: any[]) => {
              var aData: any = data;

              this.filledData = data;
              //if (this.filledForm) {
              this.RejectComments = [];
              for (let i = 0; i < this.filledData.length; i++) {
                this.RejectComments.push({
                  //user_name: this.filledData[i]["user_name"],
                  machine_name: this.filledData[i]['machine_name'], //allmachines[sec.machine_name]?.display_name
                  machine_text: this.allmachines[
                    this.filledData[i]['machine_name']
                  ]['display_name'],
                  reject_quantity: this.filledData[i]['reject_quantity'],
                  shift_date: this.datepipe.transform(
                    this.filledData[i]['shift_date'],
                    'yyyy-MM-dd'
                  ),
                  shift_name: this.filledData[i]['shift_name'],
                  created_date: this.filledData[i]['created_date'],
                  comments: this.filledData[i]['comments'],
                });
              }
              this.rejectCount = Object.keys(this.RejectComments).length;
              this.filterByMachine();
              //this.delay(5000);
            },
            (error: HttpErrorResponse) => {
              this.RejectComments = [];
              this.rejectCount = 0;
              if (error.status == 409) {
                //this.httpErrorService.onError(error);
                //this.openSnackBar("Validation", error.error);
              } else {
                //this.openSnackBar("Error", error.error);
              }
            }
            //}
          );
      }
    });
  }

  ResetFields() {
    this.reject_quantity.setValue('');
    this.comment.setValue('');
    this.machine_name.setValue(null);
    this.user_name.setValue('');
  }

  postRejectQuantityData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe((apipath) => {
      if (apipath['server'] !== undefined) {
        if (this.reject_quantity_form.valid) {
          this.shift_date.setValue(
            this.datepipe.transform(this.shift_date.value, 'yyyy-MM-dd')
          );
          this.httpClient
            .post(
              apipath['server'] + '/api/manual/qualityreject',
              this.reject_quantity_form.value
            )
            .subscribe((data: any[]) => {
              this.ResetFields();
              //this.reject_quantity_form.reset();
              this.getShiftEndData();
            });
        }
      }
    });
  }
  date(date: any, arg1: string): FormControl {
    throw new Error('Method not implemented.');
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
    seconds = Math.floor((aadMillis - dobMillis) / 1000) % 60;
    minutes = Math.floor((aadMillis - dobMillis) / 60000) % 60;
    hours = Math.floor((aadMillis - dobMillis) / 3600000) % 24;
    days = Math.floor((aadMillis - dobMillis) / 86400000);
    var monthsDec = days / daysInMonth; // Months with remainder.
    var months = Math.floor(monthsDec); // Remove fraction from month.

    days = Math.floor(daysInMonth * (monthsDec - months));
    var ago = '';
    if (years !== 0) ago = years + ' years ago';
    else if (months !== 0) ago = months + ' months ago';
    else if (days !== 0) ago = days + ' days ago';
    else if (hours !== 0) ago = hours + ' hours ago';
    else if (minutes !== 0) ago = minutes + ' minutes ago';
    else if (seconds !== 0) ago = seconds + ' seconds ago';

    return {
      years: years,
      months: months,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      ago: ago,
    };
  }
}
