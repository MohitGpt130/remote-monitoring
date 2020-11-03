import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { ManualEntryService } from '../../manual-entry.service';

interface Equipment {
  equipmentid: string,
  lineid: string,
  equipmentdisplayname: string
}
@Component({
  selector: 'app-schedule-dialog',
  styleUrls: ['./schedule-dialog.component.scss'],
  templateUrl: './schedule-dialog.component.html'
})

// export class DateValidators {
//   static dateLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
//       return (c: AbstractControl): { [key: string]: boolean } | null => {
//           const date1 = c.get(dateField1).value;
//           const date2 = c.get(dateField2).value;
//           if ((date1 !== null && date2 !== null) && date1 > date2) {
//               return validatorField;
//           }
//           return null;
//       };
//   }
// }
export class ScheduleDialogComponent implements OnInit {
  @Input() lineid: string = "";
  //@Output() onSubmit = new EventEmitter();
  @Output() onSubmit: EventEmitter<string> = new EventEmitter();

  public Equipments: Equipment[] = [];
  public todaydate = new Date();
  Eventstatus: string[] = ['Pending', 'Done'];

  //Define Form Group and Form Controls.
  scheduleform: FormGroup;

  scheduleid: FormControl;
  title: FormControl;
  start: FormControl;
  end: FormControl;
  status: FormControl;
  isEdit: FormControl;
  machine_name: FormControl;
  byWhom: FormControl;
  comment: FormControl;
  activity: FormControl;

  //Create Form control attri.
  createFormControlsSchedule() {
    this.scheduleid = new FormControl('');
    this.status = new FormControl('', Validators.required);
    this.isEdit = new FormControl('');
    this.machine_name = new FormControl('', Validators.required);
    this.byWhom = new FormControl('', Validators.required);
    this.comment = new FormControl('', Validators.required);
    this.activity = new FormControl('', Validators.required);
    this.title = new FormControl('', Validators.required);
    this.start = new FormControl('', Validators.required);
    this.end = new FormControl('', Validators.required);
  }


  createScheduleForm() {
    this.scheduleform = new FormGroup({
      scheduleid: this.scheduleid,
      title: this.title,
      start: this.start,
      end: this.end,
      isEdit: this.isEdit,
      //line_id: this.line_id,
      status: this.status,
      machine_name: this.machine_name,
      byWhom: this.byWhom,
      comment: this.comment,
      activity: this.activity
    }, { validators: this.checkDates });
  }

  checkDates(group: FormGroup) {
    // this.scheduleform.setValue({
    //   startDate: this.start.value,
    //   endDate: this.end.value
    // })
    //console.log(new Date(group.controls.end.value), new Date(group.controls.start.value))
    if (group.controls.end.value != null && group.controls.start.value != null) {
      if (new Date(group.controls.end.value) < new Date(group.controls.start.value)) {
        return { notValid: true }
      }
    }
    return null;
  }

  constructor(public dialogRef: MatDialogRef<ScheduleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder, private httpClient: HttpClient, private _snackBar: MatSnackBar,
    private manualentryservice: ManualEntryService) {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  ngOnInit() {
    this.createFormControlsSchedule();
    this.createScheduleForm();

    console.log(this.data.lineid);
    if ((this.data.lineid != null && this.data.lineid != '') || (this.lineid != null && this.lineid != '')) {
      //console.log

    }
    if (this.data != null) {
      console.log('sa');
      this.GetequipmentData(this.data.lineid);
      this.BindValueinPopUp(this.data);

    }
  }

  BindValueinPopUp(data) {
    console.log(data);
    if (data) {
      console.log(data.lineid);
      this.lineid = data.lineid;
      //this.title = data.datakey.event.title;
      console.log(data.datakey.event.meta.schedule.status);
      this.todaydate = new Date(data.datakey.event.meta.schedule.start_time) > new Date() ? new Date() : new Date(data.datakey.event.meta.schedule.start_time);
      this.scheduleform.patchValue({
        scheduleid: data.datakey.event.meta.schedule._id,
        title: data.datakey.event.title,
        start: moment(data.datakey.event.meta.schedule.start_time).format("YYYY-MM-DDTHH:mm:ss"),
        status: data.datakey.event.meta.schedule.status,
        end: moment(data.datakey.event.meta.schedule.end_time).format("YYYY-MM-DDTHH:mm:ss"),
        isEdit: true,
        machine_name: data.datakey.event.meta.schedule.activity[0].machine_name._id,
        byWhom: data.datakey.event.meta.schedule.activity[0].byWhom,
        comment: data.datakey.event.meta.schedule.activity[0].comment,
        activity: data.datakey.event.meta.schedule.activity[0].activity
      })
    }
  }

  close(): void {
    console.log('data');
    this.dialogRef.close();
  }

  GetequipmentData(lineid) {
    console.log(lineid);
    this.Equipments = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          console.log(apipath['server'] + '/api/manual/equipment/' + lineid + '?type=all');
          this.httpClient.get(apipath['server'] + '/api/manual/equipment/' + lineid + '?type=machine').subscribe(
            (data: any[]) => {
              console.log(data)
              //console.log(Object.keys(data).length);
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const Equipment_data =
                {
                  equipmentid: c._id,
                  lineid: c.line_id._id,
                  equipmentdisplayname: c.display_name,
                }
                this.Equipments.push(Equipment_data);
              }
            }
          )
        }
      }
    );
  }

  ResetForm() {
    this.scheduleform.reset();
  }
}
