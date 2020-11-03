import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-emailschedulerdailog',
  templateUrl: './emailschedulerdailog.component.html',
  styleUrls: ['./emailschedulerdailog.component.scss']
})
export class EmailschedulerdailogComponent implements OnInit {

  ScheduleEmailForm: FormGroup;

  _id: FormControl;
  TemplateCode: FormControl;
  ShiftName: FormControl;
  StartTime: FormControl;
  Frequency: FormControl;

  lineid;
  title;
  button;
  templates = [];
  shifts = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EmailschedulerdailogComponent>, private httpClient: HttpClient, private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormControlsEmailTemplate() {
    this._id = new FormControl(null);
    this.TemplateCode = new FormControl(null, Validators.required);
    this.ShiftName = new FormControl(null, Validators.required);
    this.StartTime = new FormControl(null, Validators.required);
    this.Frequency = new FormControl(null, Validators.required);


  }

  createEmailTemplateForm() {
    this.ScheduleEmailForm = new FormGroup({
      _id: this._id,
      TemplateCode: this.TemplateCode,
      ShiftName: this.ShiftName,
      StartTime: this.StartTime,
      Frequency: this.Frequency,
    });
  }

  ngOnInit() {
    if (this.data.dataKey.hasOwnProperty('rowdata')) {
      console.log("True");
      this.updateRow(this.data.dataKey.rowdata);
      this.createEmailTemplateForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      // this.GlobalKeys = this.data.dataKey.globalKeys
      this.lineid = this.data.dataKey.lineid;
      this.templates = this.data.dataKey.templates;
      this.shifts = this.data.dataKey.shifts;

    }
    else {
      this.createFormControlsEmailTemplate();
      this.createEmailTemplateForm();
      this.title = this.data.dataKey.title;
      this.button = this.data.dataKey.button;
      //console.log(this.data.dataKey.globalKeys);
      //this.GlobalKeys = this.data.dataKey.globalKeys;
      this.lineid = this.data.dataKey.lineid;
      this.templates = this.data.dataKey.templates;
      this.shifts = this.data.dataKey.shifts;
    }
  }

  updateRow(element) {
    //console.log("element updaterow: "+element);
    this._id = new FormControl(element.TemplateSchedulerId);
    this.TemplateCode = new FormControl(element.Code, Validators.required);
    this.ShiftName = new FormControl(element.ShiftName, Validators.required);
    this.StartTime = new FormControl(element.StartTime, Validators.required);
    this.Frequency = new FormControl(element.FrequencyId, Validators.required);
  }

  close() {
    this.dialogRef.close();
  }

  SubmitChanges() {

    console.log("I have reached function");
    var T = {};
    if (this._id.value !== null) {
      T = {
        _id: this._id.value,
        shift_name: this.ShiftName.value,
        start_time: this.StartTime.value,
        template_code: this.TemplateCode.value,
        frequency: this.Frequency.value,
        line_id: this.lineid,//replaced apipath['line_id'] with 5e54a412ddf58e3866836970
      }
    }
    else {
      console.log("present");
      T = {
        //_id: null,
        shift_name: this.ShiftName.value,
        start_time: this.StartTime.value,
        template_code: this.TemplateCode.value,
        frequency: this.Frequency.value,
        line_id: this.lineid,//replaced apipath['line_id'] with 5e54a412ddf58e3866836970
        //  state:this.state.value,
        //  another_language_name: this.another_language_name.value
      }
    }
    console.log("Data which is being posted : " + JSON.stringify(T));
    this.httpClient.post('http://13.127.210.191/' + '/services/eklavya/fake-api/emailtemplate2', T).subscribe(
      (data: any[]) => {
        console.log(data);
        this.dialogRef.close({ event: 'close', data: data });
        this.ScheduleEmailForm.reset();
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

}
