import { ActivatedRoute } from '@angular/router';
// import { AppService } from './../../../../../app.service';
import { Component, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-stop-input-form',
  templateUrl: './stop-input-form.component.html',
  styleUrls: ['./stop-input-form.component.scss'],
})
export class StopInputFormComponent implements OnInit {
  line_id: string;
  stopID;
  machineName;
  activeLink = 'User Input';

  faultsCauses = [];

  comments = [
    {
      user_name: '',
      comment: '',
      timestamp: '',
    },
  ];

  filledForm = false;
  filledData;

  server;

  stop_user_inputs: FormGroup;
  commentsControl: FormGroup;

  stop_id: FormControl;
  user_name: FormControl;
  addcomment_user_name: FormControl;
  selected_causes: FormControl;
  partsList_input: FormControl;
  parts: FormControl;
  partsList = [];
  first_user_comment: FormControl;
  user_comment: FormControl;
  comment: FormControl;

  faultName;
  statename: string;
  gotFaultCauses = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClient: HttpClient,
    // private appService: AppService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.stopID = this.data.dataKey.id;
    this.line_id = this.data.dataKey.line_id;
    this.machineName = this.data.dataKey.machine;

    if (this.data.dataKey.data.selectedRowValues[1].split('/').length > 2)
      this.faultName = this.data.dataKey.data.selectedRowValues[1].split(
        '/'
      )[0];

    this.stop_id = new FormControl('', Validators.required);
    this.user_name = new FormControl('', Validators.required);
    this.addcomment_user_name = new FormControl('', Validators.required);
    this.first_user_comment = new FormControl('', Validators.required);
    this.user_comment = new FormControl('', Validators.required);
    this.comment = new FormControl('', Validators.required);
    this.parts = new FormControl('');
    this.selected_causes = new FormControl('');

    this.stop_user_inputs = new FormGroup({
      stop_id: new FormControl(this.stopID),
      machine_name: new FormControl(this.machineName),
      user_name: this.user_name,
      selected_causes: this.selected_causes,
      parts: new FormControl(this.partsList),
      user_comment: this.user_comment,
    });

    this.commentsControl = new FormGroup({
      stop_id: new FormControl(this.stopID),
      addcomment_user_name: this.addcomment_user_name,
      comment: this.comment,
    });
    // this.BindFaultCause();
    //this.fetchData();
  }

  // BindFaultCause() {
  //   this.appService.getConfigurations().subscribe((configs) => {
  //     if (configs.apiConfigs.restAPI.host !== undefined) {
  //       this.server = configs.apiConfigs.restAPI.host;
  //       this.statename = this.data.dataKey.machineState;
  //       if (this.statename.includes('stop')) {
  //         if (this.statename.includes('manual_stop')) {
  //           this.statename = 'manual_stop';
  //         } else {
  //           this.statename = 'fault';
  //         }
  //       }
  //       console.log('faultcauseapi', this.server +
  //         '/api/manual/statecause?line_id=' +
  //         this.line_id +
  //         '&machine_state=' +
  //         this.statename)
  //       this.httpClient
  //         .get(
  //           this.server +
  //             '/api/manual/statecause?line_id=' +
  //             this.line_id +
  //             '&machine_state=' +
  //             this.statename
  //         )
  //         .subscribe((data: any) => {
  //           console.log(data);
  //           var aData: any = data;
  //           data.forEach(element => {
  //             console.log(this.machineName);
  //             console.log(element);
  //             if(element.machine_name && element.machine_name.equipment_name && (element.machine_name.equipment_name === this.machineName)) {
  //               this.faultsCauses.push({
  //                 cause_name: element.cause_name,
  //                 id: element._id,
  //               });
  //             }
  //           });
  //           this.gotFaultCauses = true;
  //           this.fetchData();
  //         });
  //     }
  //   });
  // }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.partsList.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(part): void {
    const index = this.partsList.indexOf(part);

    if (index >= 0) {
      this.partsList.splice(index, 1);
    }
  }

  fetchData() {
    this.httpClient
      .get(this.server + '/api/manual/comment/' + this.stopID)
      .subscribe((data) => {
        var aData: any = data;
        if (!Object.keys(data).length) {
          this.activeLink = 'User Input';
          this.filledForm = false;
        } else {
          this.activeLink = 'Comments';
          this.filledForm = true;
        }

        this.filledData = data;

        if (this.filledForm) {
          var vselected_causes = [];
          for (let i = 0; i < this.filledData.selected_causes.length; i++)
            vselected_causes.push(this.filledData.selected_causes[i]._id);

          this.comments = [];
          for (let i = 0; i < this.filledData.user_comment.length; i++)
            this.comments.push({
              user_name: this.filledData.user_comment[i].user_name,
              comment: this.filledData.user_comment[i].comment,
              timestamp: this.filledData.user_comment[i].timestamp,
            });

          // this.partsList = vpartsList;
          //

          this.partsList = this.filledData.parts;

          this.stop_user_inputs.patchValue({
            stop_id: this.filledData.stop_id._id,
            machine_name: this.filledData.stop_id.machine_name,
            user_name: this.filledData.user_comment[0].user_name,
            selected_causes: vselected_causes,
            parts: new FormControl(this.filledData.parts),
            user_comment: this.filledData.user_comment[0].comment,
          });

          this.stop_user_inputs.disable();
        } else {
          this.commentsControl.disable();
        }
      });
  }

  submitForm() {
    if (this.selected_causes.value === '') {
      this.selected_causes.patchValue([]);
      this.stop_user_inputs = new FormGroup({
        stop_id: new FormControl(this.stopID),
        machine_name: new FormControl(this.machineName),
        user_name: this.user_name,
        selected_causes: this.selected_causes,
        parts: new FormControl(this.partsList),
        user_comment: this.user_comment,
      });
    }
    if (this.stop_user_inputs.valid) {
      this.httpClient
        .post(this.server + '/api/manual/comment', this.stop_user_inputs.value)
        .subscribe((data: any[]) => {
          console.log(data);
          this.stop_user_inputs.reset();
          this.fetchData();
          this.ngOnInit();
          // this.stop_user_inputs.disable();
        });
    } else {
    }
  }

  sendComment() {
    if (this.commentsControl.valid && this.filledForm) {
      console.log(this.server + '/api/manual/addcomment', JSON.stringify(this.stop_user_inputs.value))

      this.httpClient
        .post(
          this.server + '/api/manual/addcomment',
          this.commentsControl.value
        )
        .subscribe((data: any[]) => {
          this.commentsControl.reset();
          this.ngOnInit();
          // this.fetchData();
        });
    } else {
    }
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
