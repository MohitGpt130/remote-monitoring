import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-emailtemplatedailog',
  templateUrl: './emailtemplatedailog.component.html',
  styleUrls: ['./emailtemplatedailog.component.scss']
})
export class EmailtemplatedailogComponent implements OnInit {

  emailTemplateForm: FormGroup;

  _id: FormControl;
  To: FormControl;
  Cc: FormControl;
  Bcc: FormControl;
  TemplateName: FormControl;
  Subject: FormControl;
  Body: FormControl;
  Code: FormControl;

  lineid;
  title;
  button;
  //GlobalKeys;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EmailtemplatedailogComponent>,private httpClient: HttpClient, private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormControlsEmailTemplate() {
    this._id = new FormControl(null);
    this.To = new FormControl(null, Validators.required);
    this.Cc = new FormControl(null, Validators.required);
    this.Bcc = new FormControl(null, Validators.required);
    this.TemplateName = new FormControl(null, Validators.required);
    this.Subject = new FormControl(null, Validators.required);
    this.Body = new FormControl(null, Validators.required);
    this.Code = new FormControl(null, Validators.required);


  }

  createEmailTemplateForm() {
    this.emailTemplateForm = new FormGroup({
      _id: this._id,
      To: this.To,
      Cc: this.Cc,
      Bcc: this.Bcc,
      TemplateName: this.TemplateName,
      Subject: this.Subject,
      Body: this.Body,
      Code: this.Code,
    });
  }

  ngOnInit() {
     //console.log(this.data.dataKey.rowdata);
     if(this.data.dataKey.hasOwnProperty('rowdata'))
     {
       console.log("True");
     this.updateRow(this.data.dataKey.rowdata);
     this.createEmailTemplateForm();
     this.title = this.data.dataKey.title;
     this.button = this.data.dataKey.button;
    // this.GlobalKeys = this.data.dataKey.globalKeys
     this.lineid = this.data.dataKey.lineid;
     //console.log("hi "+this.data.dataKey.globalKeys);
     //this.updateRow(this.data.datakey.rowdata);
     }
     else
     {
       this.createFormControlsEmailTemplate();
       this.createEmailTemplateForm();
       this.title = this.data.dataKey.title;
       this.button = this.data.dataKey.button;
       //console.log(this.data.dataKey.globalKeys);
       //this.GlobalKeys = this.data.dataKey.globalKeys;
       this.lineid = this.data.dataKey.lineid;
     }
  }

  updateRow(element) {
    //console.log("element updaterow: "+element);
    this._id = new FormControl(element.Templateid);
    this.To = new FormControl(element.To, Validators.required);
    this.Cc = new FormControl(element.Cc, Validators.required);
    this.Bcc = new FormControl(element.Bcc, Validators.required);
    this.TemplateName = new FormControl(element.Templatename, Validators.required);
    this.Subject = new FormControl(element.Subject, Validators.required);
    this.Body = new FormControl(element.Body, Validators.required);
    this.Code = new FormControl(element.Code, Validators.required);
  }

  close() {
    this.dialogRef.close();
  }

  SubmitChanges()
   {

    console.log("I have reached function");
    var T = {};
    if(this._id.value !== null)
    {
        T = {
        _id: this._id.value,
        Cc: this.Cc.value,
        Bcc: this.Bcc.value,
        To: this.To.value,
        TemplateName: this.TemplateName.value,
        Subject: this.Subject.value,
        Body: this.Body.value,
        Code: this.Code.value,
        line_id: this.lineid,//replaced apipath['line_id'] with 5e54a412ddf58e3866836970
      }
    }
    else{
      console.log("present");
            T = {
        //_id: null,
        Cc: this.Cc.value,
        Bcc: this.Bcc.value,
        To: this.To.value,
        TemplateName: this.TemplateName.value,
        Subject: this.Subject.value,
        Body: this.Body.value,
        Code: this.Code.value,
        line_id: this.lineid,//replaced apipath['line_id'] with 5e54a412ddf58e3866836970
      //  state:this.state.value,
      //  another_language_name: this.another_language_name.value
      }
    }

    console.log("Data which is being posted : "+JSON.stringify(T));
    this.httpClient.post('http://13.127.210.191/' + '/services/eklavya/fake-api/emailtemplate2', T).subscribe(
        (data: any[]) => {
        console.log(data);
        this.dialogRef.close({event:'close',data:data});
        this.emailTemplateForm.reset();
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




  //   console.log("I have reached function");
  //   this.httpClient.get('configs/apix/api_server.json').subscribe(
  //     apipath => {
  //       if (apipath['server'] !== undefined) {
  //         var T = {};
  //         if(this._id.value !== null)
  //         {
  //             T = {
  //             _id: this._id.value,
  //             Cc: this.Cc.value,
  //             Bcc: this.Bcc.value,
  //             To: this.To.value,
  //             TemplateName: this.TemplateName.value,
  //             Subject: this.Subject.value,
  //             Body: this.Body.value,
  //             line_id: this.lineid,//replaced apipath['line_id'] with 5e54a412ddf58e3866836970
  //           }
  //         }
  //         else{
  //           console.log("present");
  //                T = {
  //             //_id: null,
  //             Cc: this.Cc.value,
  //             Bcc: this.Bcc.value,
  //             To: this.To.value,
  //             TemplateName: this.TemplateName.value,
  //             Subject: this.Subject.value,
  //             Body: this.Body.value,
  //             line_id: this.lineid,//replaced apipath['line_id'] with 5e54a412ddf58e3866836970
  //           //  state:this.state.value,
  //           //  another_language_name: this.another_language_name.value
  //           }
  //         }

  //         console.log("Data which is being posted : "+JSON.stringify(T));
  //         console.log(apipath['server']);
  //         this.httpClient.post(apipath['server'] + '/api/type', T).subscribe(
  //             (data: any[]) => {
  //             console.log(data);
  //             this.dialogRef.close({event:'close',data:data});
  //             this.emailTemplateForm.reset();
  //             //this.openSnackBar("Request Successfull");
  //           },
  //           (error: HttpErrorResponse) => {
  //             console.log(error);
  //             if (error.status == 409) {
  //               this.openSnackBar("Validation", error.error);
  //             }
  //             else {
  //               this.openSnackBar("Error", error.error);
  //             }
  //           }
  //         );
  //       }
  //     });


   }

}
