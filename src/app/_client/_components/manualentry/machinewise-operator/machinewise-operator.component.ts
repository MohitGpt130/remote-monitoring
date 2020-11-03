import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getDate } from 'date-fns';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ManualEntryService } from '../../manual-entry.service';


@Component({
  selector: 'app-machinewise-operator',
  templateUrl: './machinewise-operator.component.html',
  styleUrls: ['./machinewise-operator.component.scss']
})
export class MachinewiseOperatorComponent implements OnInit {
 // tomorrow = new Date();
 operator_report:FormGroup
 date: FormControl;


 createOperatorReportForm(){
  this.date = new FormControl('', Validators.required);
 }

 createOperatorWiseReportForm(){
  this.operator_report = new FormGroup({
    date: this.date,
  }
  );
 }


  constructor(private httpClient: HttpClient, public dialog: MatDialog, public datepipe: DatePipe, protected manualentryservice: ManualEntryService) { }

  ngOnInit() {
    this.createOperatorReportForm();
    this.createOperatorWiseReportForm();
  }

}
