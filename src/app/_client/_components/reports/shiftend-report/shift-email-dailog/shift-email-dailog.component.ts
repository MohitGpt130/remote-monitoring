import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shift-email-dailog',
  templateUrl: './shift-email-dailog.component.html',
  styleUrls: ['./shift-email-dailog.component.scss']
})
export class ShiftEmailDailogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private httpClient: HttpClient, private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  emailbody;
  shift_email_dailog: FormGroup;
  emailaddress: FormControl;

  createFormControlsShiftEndEmailForm() {
    this.emailaddress = new FormControl('', Validators.required);
  }

  createShiftEndEmailForm() {
    this.shift_email_dailog = new FormGroup({
      emailaddress: this.emailaddress
    });
  }

  ngOnInit() {
    this.emailbody = this.data.dataKey.emaildata;
    this.createFormControlsShiftEndEmailForm();
    this.createShiftEndEmailForm();
    console.log(this.data.dataKey.emaildata);
  }

  postEmail(email, to, subject) {
    console.log(email);

    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.post(apipath['server'] + '/api/manual/emailreportdata', {
            "emailbody": "" + email + "",
            "to": "" + to + "",
            "subject": "" + subject + ""
          }).subscribe(
            (data: any[]) => {
              console.log(data);
            }
          );
          this.openSnackBar("Success", "Email sent successfully");
        }
      });
  }
  sendemail() {
    //console.log(this.emailaddress.value);
    if (this.emailaddress.value != "") {
      this.postEmail(this.emailbody, this.emailaddress.value, "Shift End Report");
    }
  }
}
