import { ManualEntryService } from './../../manual-entry.service';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EmailtemplatedailogComponent } from './emailtemplatedailog/emailtemplatedailog.component';

interface EmailTemplate {
  Templateid: string;
  TemplateLineid: string;
  Templatename: string;
  To: string;
  Cc: string;
  Bcc: string;
  Subject: string;
  Body: string;
  Code: string;
 // lossTypeState: string;
}

@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.scss']
})
export class EmailtemplateComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, public dialog: MatDialog, private manualentryservice: ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  @Input() lineid: string;
  displayedColumns: string[];// = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];

  public eTemplate: EmailTemplate[] = [];
  dataSource: MatTableDataSource<EmailTemplate>;

  displayedColumnsAs = {
    Templateid: { 'DN': 'Template Id', 'visible': true },
    TemplateLineid: {'DN': 'Line Id', 'visible': true},
    Templatename: { 'DN': 'Name', 'visible': false},
    Cc: { 'DN': 'Cc', 'visible': false },
    To: { 'DN': ' to', 'visible': false },
    Bcc: {'DN': 'Bcc', 'visible': false},
    Body: {'DN': 'Body', 'visible': false},
    Subject: {'DN': 'Subject', 'visible': false},
    Code: {'DN': 'Code', 'visible': false},
  }

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  GetEmailTemplateData(lineid,type='') {
    //console.log("lineID: "+lineid);
    this.eTemplate = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

      this.manualentryservice.GetEmailTemplateData('eklavya', 'fake-api','emailtemplate3', 'https://smartfactoryworx.net/').subscribe((emailTemplateData: any[]) => {
        for (let i = 0; i < emailTemplateData.length; i++) {
          const c = emailTemplateData[i];
          const cause_data =
          {
            Templateid: c._id,
            TemplateLineid:c.line_id,
            Templatename: c.templatename,
            To: c.to,
            Cc: c.cc,
            Bcc:c.bcc,
            Body:c.bodycontent,
            Subject:c.subject,
            Code:c.templatecode
          }
          this.eTemplate.push(cause_data);
         // console.log("cause_data: "+JSON.stringify(cause_data));
        }

        this.vdisplayedColumns = [];
        if (Object.keys(emailTemplateData).length > 0) {
          for (let i = 0; i < Object.keys(this.eTemplate[0]).length; i++) {
            this.vdisplayedColumns.push(Object.keys(this.eTemplate[0])[i]);
          }
          this.vdisplayedColumns.push('star');
          this.gotData = true;
          this.dataSource = new MatTableDataSource(this.eTemplate);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.displayedColumns = this.vdisplayedColumns;
        }
        else {
          console.log('else part called');
          this.gotData = true;
          this.dataSource = null;
          this.displayedColumns = this.vdisplayedColumns;
        }
      });
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.lineid = changes.lineid.currentValue;
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      console.log("----ngOnChange function----");
      this.GetEmailTemplateData(this.lineid);
      //changes.lineid.currentValue replaced with '5e5113fbfba653297ef343aa'
    }
  }

  ngOnInit() {
    console.log("hi");
    //this.GetEmailTemplateData('');
  }

  ClearElements() {
    //this._id.setValue("");
  }

  deleteRow(element) {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  DailogAddEmailTemplate() {
    const dialogRef = this.dialog.open(EmailtemplatedailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          title:'Add Details',
          button: 'Done'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      //this.dialogValue = result.data;
      this.GetEmailTemplateData(result.line_id,result.type);
      this.openSnackBar("Success", "Records Added Successfully");
    });
  }

  DailogUpdateEmailTemplate(element) {
    // console.log("fuction called");
     //console.log("this is element: "+JSON.stringify(element));
    const dialogRef = this.dialog.open(EmailtemplatedailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          rowdata: element,
          title:'Update Details',
          button: 'Update'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      //this.dialogValue = result.data;
      this.GetEmailTemplateData(result.line_id,result.type);
      this.openSnackBar("Success", "Records Updated Successfully");

    });
  }
}
