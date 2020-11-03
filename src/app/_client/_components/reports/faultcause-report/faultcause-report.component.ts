import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-faultcause-report',
  templateUrl: './faultcause-report.component.html',
  styleUrls: ['./faultcause-report.component.scss']
})

export class FaultcauseReportComponent implements OnInit {

  faultcausereport: FormGroup;
  startDate: FormControl;
  endDate: FormControl;
  tablestructure;
  FaultCauseParameters;
  MatchedDataParameters: string[] = [];
  backgroundcolor;
  //filterparametercounter = 0;
  cdata;
  createFormControlsShiftReportForm() {
    this.startDate = new FormControl('', Validators.required);
    this.endDate = new FormControl('', Validators.required);
  }

  createShiftReportForm() {
    this.faultcausereport = new FormGroup({
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  constructor(private httpClient: HttpClient, public dialog: MatDialog, public datepipe: DatePipe) {
    this.FilterFaultCauseData();

  }

  ngOnInit() {
    this.createFormControlsShiftReportForm();
    this.createShiftReportForm()
  }

  FilterFaultCauseData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get('configs/apix/faultcause_data_pattern.json').subscribe(
            vdata => {
              this.FilterReport(apipath['server'], vdata, this.startDate.value, this.endDate.value);
            }
          );
        } else {
        }
      }
    );
  }

  ChangeDateFormat(date) {
    return this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  FilterReport(servername, vdata, startdate, enddate) {
    this.tablestructure = "";
    this.MatchedDataParameters = [];
    if (startdate === "" && enddate === "") {
      startdate = this.ChangeDateFormat(new Date());
      enddate = this.ChangeDateFormat(new Date());
    }
    else {
      startdate = this.ChangeDateFormat(startdate);
      enddate = this.ChangeDateFormat(enddate);
    }
    //Getting parameters from JSON
    this.FaultCauseParameters = Object.keys(vdata['table']['parameters']);
    //  startdate = "2019-11-11";
    //  enddate = "2019-11-16";
    this.startDate.setValue(startdate);
    this.endDate.setValue(enddate);
    this.httpClient.get(servername + '/api/manual/commentreport?startDate=' + startdate + '&endDate=' + enddate).subscribe(
      data => {
        if (Object.keys(data).length > 0) {
          this.tablestructure = '<table border="1" width="100%" cellpadding="8" cellspacing="1"><tr>';
          //this.tablestructure = this.tablestructure + "<td>" + Object.keys(data[Object.keys(data)[0]]) + "</td>";
          for (let i = 0; i < Object.keys(data).length; i++) {
            //Creating Header of Table
            for (let j = 0; j < Object.keys(data[Object.keys(data)[0]]).length; j++) {
              if (this.FaultCauseParameters[i] === Object.keys(data[Object.keys(data)[i]])[j]) {
                this.MatchedDataParameters.push(Object.keys(data[Object.keys(data)[i]])[j]);
                //if (vdata['table']['parameters'][Object.keys(data[Object.keys(data)[i]])[j]]['type'] === 'var') {
                  this.tablestructure = this.tablestructure + "<td mat-sort-header='" + [Object.keys(data[Object.keys(data)[i]])[j]] + "' bgcolor='" + vdata['table']['parameters'][Object.keys(data[Object.keys(data)[i]])[j]]['background_color'] + "'>" + vdata['table']['parameters'][Object.keys(data[Object.keys(data)[i]])[j]]['display_name'] + "</td>";
                //}
                //else {
                 // this.tablestructure = this.tablestructure + "<td mat-sort-header='" + [Object.keys(data[Object.keys(data)[i]])[j]] + "' bgcolor='" + vdata['table']['parameters'][Object.keys(data[Object.keys(data)[i]])[j]]['background_color'] + "'>" + vdata['table']['parameters'][Object.keys(data[Object.keys(data)[i]])[j]]['display_name'] + "</td>";
                //}

              }
            }
          }
          for (let i = 0; i < Object.keys(data).length; i++) {

            if (i % 2 == 0) {
              this.backgroundcolor = vdata['table']['alternateTableColor']['Even'];
            }
            else {
              this.backgroundcolor = vdata['table']['alternateTableColor']['Odd'];
            }

            this.tablestructure = this.tablestructure + "</tr><tr bgcolor='" + this.backgroundcolor + "'>";
            for (let j = 0; j < this.MatchedDataParameters.length; j++) {
              if (vdata['table']['parameters'][this.MatchedDataParameters[j]]['type'] === 'var') {
                if (Object.keys(data[Object.keys(data)[i]])[j] === 'machine_name') {
                  this.tablestructure = this.tablestructure + "<td bgcolor=" + vdata['table']['Machines'][data[i][this.FaultCauseParameters[j]]]['color'] + ">" + vdata['table']['Machines'][data[i][this.FaultCauseParameters[j]]]['display_name'] + "</td>";
                }
                else {
                  this.tablestructure = this.tablestructure + "<td>" + data[i][this.FaultCauseParameters[j]] + "</td>";
                }
              }
              else if (vdata['table']['parameters'][this.MatchedDataParameters[j]]['type'] === 'multi') {

                this.tablestructure = this.tablestructure + "<td>" + this.GenerateComments(data[i][this.FaultCauseParameters[j]], vdata) + "</td>";
              }
              else if (vdata['table']['parameters'][this.MatchedDataParameters[j]]['type'] === 'date') {
                //this.tablestructure = this.tablestructure + "<td>" +  this.ChangeDateFormat(this.GenerateComments(data[i][this.FaultCauseParameters[j]])) + "</td>";
                this.tablestructure = this.tablestructure + "<td>" + this.ChangeDateFormat(data[i][this.FaultCauseParameters[j]]) + "</td>";
              }
            }
          }
          this.tablestructure = this.tablestructure + "</tr></table>"
        }
        else {
          this.tablestructure = this.tablestructure + "<font color='blue'><table  width='100%' border=1 cellspacing =><tr><td align='center'>No RECORDS FOUND</td></tr></table></font>";
        }
      }
    );
  }

  GenerateComments(commentData, vdata) {
    this.cdata = "";
    this.backgroundcolor = "";
    //this.cdata = "<table border='1' width='100%'>";
    for (let i = 0; i < Object.keys(commentData).length; i++) {
      if (i % 2 == 0) {
        this.backgroundcolor = vdata['table']['color']['Even'];
      }
      else {
        this.backgroundcolor = vdata['table']['color']['Odd'];
      }
      this.cdata = this.cdata + "<table bgcolor='" + this.backgroundcolor + "' border='1' width='100%'>";
      for (let j = 0; j < Object.keys(commentData[i]).length; j++) {
        this.cdata = this.cdata + "<tr>";
        //bgcolor='"+vdata['table']['subparameter'][Object.keys(commentData[i])[j]]['background_color']+"'
        this.cdata = this.cdata + "<td width='15%'>" + vdata['table']['subparameter'][Object.keys(commentData[i])[j]]['display_name'] + "</td>";
        //bgcolor='"+vdata['table']['subparameter'][Object.keys(commentData[i])[j]]['background_color']+"'
        this.cdata = this.cdata + "<td width='85%'>" + commentData[i][Object.keys(commentData[i])[j]] + "</td>";
        this.cdata = this.cdata + "</tr>";
      }
      this.cdata = this.cdata + "</table>";
    }
    return this.cdata;
  }
}
