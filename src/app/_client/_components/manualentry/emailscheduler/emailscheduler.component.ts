import { ManualEntryService } from './../../manual-entry.service';
import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EmailschedulerdailogComponent } from './emailschedulerdailog/emailschedulerdailog.component';

interface SchedulerTemplate {
  TemplateSchedulerId: string;
  TemplateSchedulerLineId: string;
  FrequencyVal: string;
  FrequencyId: String;
  ShiftName: string;
  StartTime: string;
  Code: string;
 // lossTypeState: string;
}


@Component({
  selector: 'app-emailscheduler',
  templateUrl: './emailscheduler.component.html',
  styleUrls: ['./emailscheduler.component.scss']
})
export class EmailschedulerComponent implements OnInit {

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
  Shifts = [];
  Templates = [];

  public schedulerTemplate: SchedulerTemplate[] = [];
  dataSource: MatTableDataSource<SchedulerTemplate>;

  displayedColumnsAs = {
    TemplateSchedulerId: { 'DN': 'Scheduler Id', 'visible': true },
    TemplateSchedulerLineId: {'DN': 'Line Id', 'visible': true},
    FrequencyId: {'DN': 'Frequnecy Id', 'visible': true},
    ShiftName: { 'DN': 'Shift Name', 'visible': false },
    FrequencyVal: { 'DN': ' Frequency', 'visible': false },
    StartTime: {'DN': 'Start Time', 'visible': false},
    Code: {'DN': 'Code', 'visible': false},
  }

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  GetEmailScheduleData(lineid,type='') {
    //console.log("lineID: "+lineid);
    this.schedulerTemplate = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

      this.manualentryservice.GetEmailTemplateData('eklavya', 'fake-api','emailscheduler', 'https://smartfactoryworx.net/').subscribe((schedulerData: any[]) => {
        for (let i = 0; i < schedulerData.length; i++) {
          const c = schedulerData[i];
          const cause_data =
          {
            TemplateSchedulerId: c._id,
            TemplateSchedulerLineId:c.line_id,
            FrequencyVal: c.frequencyVal,
            FrequencyId: c.frequency,
            ShiftName: c.shift_name,
            StartTime:c.start_time,
            Code:c.template_code
          }
          this.schedulerTemplate.push(cause_data);
         // console.log("cause_data: "+JSON.stringify(cause_data));
        }

        this.vdisplayedColumns = [];
        if (Object.keys(schedulerData).length > 0) {
          for (let i = 0; i < Object.keys(this.schedulerTemplate[0]).length; i++) {
            this.vdisplayedColumns.push(Object.keys(this.schedulerTemplate[0])[i]);
          }
          this.vdisplayedColumns.push('star');
          this.gotData = true;
          this.dataSource = new MatTableDataSource(this.schedulerTemplate);
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
      this.GetEmailScheduleData(this.lineid);
      //changes.lineid.currentValue replaced with '5e5113fbfba653297ef343aa'
    }
  }

  ngOnInit() {
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

  // send shift names to the modal
  SendShiftsToModal() {

    this.Shifts = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

      this.manualentryservice.GetShiftDetails(serverdetails['server'], this.lineid).subscribe((shifts: any[]) => {
        //console.log(shifts);
        for (let i = 0; i < shifts.length; i++) {
          const c = shifts[i];
          let a:string [] = [''];
          //console.log(c._id);
          a.push(c._id);
          a.push(c.shift);
        //  console.log("values "+a);
          this.Shifts.push(a);
         // console.log(this.machineStates);

        }
       // console.log(this.Shifts);

      });
    });
    return this.Shifts;
  }

  // send Templates to the modal
  SendTemplatesToModal() {

    this.Templates = [];
    this.manualentryservice.GetServerAPIPath().subscribe(serverdetails => {

      this.manualentryservice.GetEmailTemplateData('eklavya', 'fake-api','emailscheduler', 'https://smartfactoryworx.net/').subscribe((emailTemplateData: any[]) => {
       // console.log("IIII"+JSON.stringify(emailTemplateData));
        for (let i = 0; i < emailTemplateData.length; i++) {
          const c = emailTemplateData[i];
          let a:string [] = [''];
          //console.log(c._id);
          a.push(c.template_code);
          //a.push(c.templatename);
        //  console.log("values "+a);
          this.Templates.push(a);
         // console.log(this.machineStates);

        }
       // console.log(this.Shifts);

      });
    });
    //console.log("HHHH"+this.Templates);
    return this.Templates;
  }

  DailogAddEmailScheduleData() {
    const dialogRef = this.dialog.open(EmailschedulerdailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          title:'Add Details',
          button: 'Done',
          shifts: this.SendShiftsToModal(),
          templates: this.SendTemplatesToModal(),
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      //this.dialogValue = result.data;
      this.GetEmailScheduleData(result.line_id,result.type);
      this.openSnackBar("Success", "Records Added Successfully");
    });
  }

  DailogUpdateEmailScheduleData(element) {
    // console.log("fuction called");
     console.log("this is element: "+JSON.stringify(element));
    const dialogRef = this.dialog.open(EmailschedulerdailogComponent, {
      width: '500px',
      height: '400px'
      ,
      data: {
        dataKey: {
          lineid: this.lineid,
          rowdata: element,
          title:'Update Details',
          button: 'Update',
          shifts: this.SendShiftsToModal(),
          templates: this.SendTemplatesToModal()
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      //this.dialogValue = result.data;
      this.GetEmailScheduleData(result.line_id,result.type);
      this.openSnackBar("Success", "Records Updated Successfully");

    });
  }

}
