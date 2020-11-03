import { ManualEntryService } from './../../manual-entry.service';
import { ShiftEmailDailogComponent } from './shift-email-dailog/shift-email-dailog.component';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';

import html2canvas from 'html2canvas';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getDate } from 'date-fns';
import * as moment from 'moment';
import { constant } from 'lodash';

@Component({
  selector: 'app-shiftend-report',
  templateUrl: './shiftend-report.component.html',
  styleUrls: ['./shiftend-report.component.scss']
})
export class ShiftendReportComponent implements OnInit {
  tomorrow = new Date();
  Shiftdata = {};
  ShiftDataParameters: string[] = [];
  filteredShiftData = {};

  shift_report: FormGroup;
  date: FormControl;
  shift: FormControl;

  createFormControlsShiftReportForm() {
    this.date = new FormControl('', Validators.required);
    this.shift = new FormControl('', Validators.required);
  }

  createShiftReportForm() {
    this.shift_report = new FormGroup({
      date: this.date,
      shift: this.shift
    });
  }

  tablestructure;
  styleAttribute;
  headerStructure;
  footStructure;
  bottlelossStructure;
  shiftEndcomment;
  Machines; //= ['filler', 'induction', 'labeller', 'shrink', 'case_erector', 'case_packer', 'weigher', 'case_sealer'];
  MachineNames: any[];
  Shifts: string[]; //= ['Shift A', 'Shift B'];
  myDate;
  constructor(private httpClient: HttpClient, public dialog: MatDialog, public datepipe: DatePipe, protected manualentryservice: ManualEntryService) {
    this.FilterReportData();
  }

  FilterReportData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        this.MachineNames = Object.values(apipath['machines']);
        this.Machines = apipath['machines'];
        //this.Machines = Object.keys(apipath['machines']);
        this.Shifts = Object.keys(apipath['shift_timings']);
        if (apipath['server'] !== undefined) {
          this.httpClient.get('configs/apix/shift_end_data_pattern.json').subscribe(
            vdata => {
              this.FilterReport(apipath['server'], apipath['line_id'], vdata, this.date.value, this.shift.value);
              //this.httpClient.get('configs/apix/test.json').subscribe(
            }
          );
        } else {
        }
      }
    );
  }

  FilterReport(apipath, lineid, vdata, shiftdate, shiftname) {
    //this.Machines = Object.keys(this.machines).filter(key => this.allLinkedmachines.includes(key)).reduce((obj, key) => { obj[key] = this.machines[key]; return obj; }, {});
    // if (shiftdate !== "") {
    //   shiftdate = this.datepipe.transform(shiftdate, 'yyyy-MM-dd');
    // }
    // else {
    //   shiftdate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    //   shiftname = 'Shift A';

    //   //this.shift =
    // }
    this.ShiftDataParameters = Object.keys(vdata['table']['parameters']);

    //this.manualentryservice.GetPreviousShift(apipath).subscribe((shiftdetails) => {
    if (shiftdate === "") {
      var temp = new Date();
      shiftdate = this.datepipe.transform(temp.setDate(temp.getDate() - 1), 'yyyy-MM-dd');
      shiftname = "Shift A";
      //shiftdate = '2020-05-07'
      // var d1 = moment(new Date(this.manualentryservice.ConvertToLocalTimezone(new Date(shiftdetails['current_shift'].current_timeStamp))), 'HH:mm:ss');
      // // + new Date(shiftdetails['current_shift'].shiftStartTime).getTime());// - new Date(shiftdetails['current_shift'].current_timeStamp.shiftStartTime));
      // var d2 = moment(new Date(shiftdetails['current_shift'].shiftStartTime), 'HH:mm:ss');
      // if (d1.diff(d2, 'minutes') >= 60) {

      //   shiftdate = this.datepipe.transform(new Date(shiftdetails['pre_shift'].shiftStartTime), 'yyyy-MM-dd');
      //   shiftname = shiftdetails['pre_shift'].shift;
      // }
      // else {
      //   shiftdate = this.datepipe.transform(new Date(shiftdetails['pre_pre_shift'].shiftStartTime), 'yyyy-MM-dd');
      //   shiftname = shiftdetails['pre_pre_shift'].shift;
      // }
    }
    else {
      shiftdate = this.datepipe.transform(this.date.value, 'yyyy-MM-dd');
      shiftname = this.shift.value;

    }

    this.shift.setValue(shiftname);
    this.date.setValue(shiftdate);

    this.manualentryservice.GetShiftEndReport(apipath, lineid, shiftdate, shiftname).subscribe(
      //this.httpClient.get(apipath + '/api/stops/report?parameter_wise&date=' + shiftdate + '&shift=' + shiftname).subscribe(
      data => {
        // this.Machines = equipments;
        //this.Machines= this.Machines.filter((m) => Object.keys(data['oee']).includes(m));
        this.Machines = Object.keys(this.Machines).filter(key => Object.keys(data['oee']).includes(key)).reduce((obj, key) => { obj[key] = this.Machines[key]; return obj; }, {});

        this.styleAttribute = "";
        // this.headerStructure = "<table  class='table' border='1' cellpadding='8' cellspacing='0' bgcolor='#00e6e6' width='100%'><tr>";
        // for (let i = 0; i < Object.keys(data['shift_details']).length; i++) {
        //   this.headerStructure = this.headerStructure + "<td align='center'><font color='#000080'>" + Object.keys(data['shift_details'])[i].toUpperCase() + "</font>  :  <font color='red'>" + data['shift_details'][Object.keys(data['shift_details'])[i]] + "</font></td>";
        // }
        // this.headerStructure = this.headerStructure + "</tr></table>";
        this.tablestructure = "<font face ='Arial'><table width='100%' cellpadding='8' cellspacing='2' class='table table-bordered  table-sm mt-3 text-center'><tr bgcolor='#3d3d29'><td></td>";
        for (let i = 0; i < Object.keys(this.Machines).length; i++) {
          this.tablestructure = this.tablestructure + "<td align='center'><font color='white'><b>" + this.Machines[Object.keys(this.Machines)[i]]['display_name'] + "</b></font></td>"
        }
        this.tablestructure = this.tablestructure + "</tr>"

        for (let i = 0; i < this.ShiftDataParameters.length; i++) {
          for (let k = 0; k < Object.keys(data).length; k++) {
            if (this.ShiftDataParameters[i] === Object.keys(data)[k]) {
              this.tablestructure = this.tablestructure + "<tr bgcolor='" + vdata['table']['parameters'][Object.keys(data)[k]]['background_color'] + "'>";
              this.tablestructure = this.tablestructure + "<td align='left' padding='100px' width=18%>" + vdata['table']['parameters'][Object.keys(data)[k]]['display_name'] + "</td>";
              for (let j = 0; j < Object.keys(this.Machines).length; j++) {

                if (Object.keys(data)[k] === "current_sku") {
                  //Need to make colspan only a single time so made j=0
                  if (j === 0) {
                    this.tablestructure = this.tablestructure + "<td align='center' padding=2% colspan='" + Object.keys(this.Machines).length + "'>" + data[Object.keys(data)[k]][Object.keys(this.Machines)[j]] + "</td>";
                  }
                }
                else {
                  var primarySplit = vdata['table']['parameters'][Object.keys(data)[k]]['primarySplit'];
                  var secondaySplit = vdata['table']['parameters'][Object.keys(data)[k]]['secondarySplit'];
                  var Text = data[Object.keys(data)[k]][Object.keys(this.Machines)[j]];
                  var format = vdata['table']['parameters'][Object.keys(data)[k]]['format'];
                  var initial = vdata['table']['parameters'][Object.keys(data)[k]]['initial'];
                  var textalign = vdata['table']['parameters'][Object.keys(data)[k]]['textalign'];
                  var fontBold = vdata['table']['parameters'][Object.keys(data)[k]]['fontBold'];
                  var splitTableWidth = vdata['table']['parameters'][Object.keys(data)[k]]['splitTableWidth'];
                  var splitWidthIndividual = vdata['table']['parameters'][Object.keys(data)[k]]['splitWidthIndividual'];
                  var cellWidth = vdata['table']['parameters'][Object.keys(data)[k]]['cellWidth'];

                  if (this.CheckIfObject(Text)) {
                    console.log(Text['value']);
                    try {
                      var Data = this.SplitFunction(initial + Text['value'] + format, primarySplit, secondaySplit, splitTableWidth, splitWidthIndividual);
                      this.tablestructure = this.tablestructure + "<td width='" + cellWidth + "'  align='" + textalign + "' bgcolor='" + Text['backgroundColor'] + "'>" + this.FunctionMakeFontBold(fontBold, Data) + "</td>";
                    }
                    catch
                    {
                      //this.tablestructure = this.tablestructure+"";
                    }
                  }
                  else {
                    var Data = this.SplitFunction(initial + Text + format, primarySplit, secondaySplit, splitTableWidth, splitWidthIndividual);
                    this.tablestructure = this.tablestructure + "<td width='" + cellWidth + "' align='" + textalign + "' >" + this.FunctionMakeFontBold(fontBold, Data) + "</td>";
                  }
                }
              }
              this.tablestructure = this.tablestructure + "</tr>";
              break;
            }
          }
        }
        // this.tablestructure = this.tablestructure + "</table></font></br>";

        // this.footStructure = '<font face ="Arial"><table width="65%" border="1" cellpadding="0" cellspacing="0"><tr bgcolor="#ffad99"><td align="center" colspan="3"><h5>BOTTLE LOSS : ' + data["Bottle_loss"]["Total"] + '</h5></td></tr><tr>';
        // this.footStructure = this.footStructure + "<td valign='top' >" + this.GetBottleLostStructure(data, 'Availability') + "</td>";
        // this.footStructure = this.footStructure + "<td valign='top'>" + this.GetBottleLostStructure(data, 'Performance') + "</td>";
        // this.footStructure = this.footStructure + "<td valign='top'>" + this.GetBottleLostStructure(data, 'Quality') + "</td>";
        // this.footStructure = this.footStructure + "</tr></table></font></br>";

        //---------------------------------------------------------------------------------------------------------------------------------
        // this.shiftEndcomment = "<table class='table' cellspacing='0' cellpadding='4' width='100%' border='1'><tr><td colspan='2' bgcolor='#ffad99' align='center'>SHIFT END COMMENTS</td></tr>";
        // // created_date: "2019-11-06T05:00:56.732Z"
        // if (Object.keys(data["shift_end_comment"]).length > 0) {
        //   this.shiftEndcomment = this.shiftEndcomment + "<tr><td align='center' bgcolor='#99ff99' width='10%'>Name</td><td bgcolor='#99ff99' width='90%' align='center'>Comment</td></tr>"
        // }
        // else {
        //   this.shiftEndcomment = this.shiftEndcomment + "<tr><td colspan='2' align='center'>None</td></tr>"
        // }
        // for (let k = 0; k < Object.keys(data["shift_end_comment"]).length; k++) {
        //   this.shiftEndcomment = this.shiftEndcomment + " <tr><td><font color='#000080'>" + data["shift_end_comment"][k]["user_name"] + "</font></td><td>" + data["shift_end_comment"][k]["comment"] + "</td></tr>"
        // }
        // this.shiftEndcomment = this.shiftEndcomment + "</table>";
      });
    //})
  }


  FunctionMakeFontBold(bitFontBold, text) {
    if (bitFontBold === true) {
      return "<strong>" + text + "</strong>"
    }
    else {
      return text;
    }
  }


  CheckIfObject(val) {
    var t = "";
    if (typeof (val) === 'object') {

      //t = "<td>"+val['value']+"</td>";

      return true;
    }
    return false;
  }


  SplitFunction(text, primarySplit, SecondarySplit, splitTableWidth, splitWidthIndividual) {
    console.log(text, primarySplit, SecondarySplit, splitTableWidth, splitWidthIndividual);

    var t1 = "<table cellspacing='0' width='" + splitTableWidth + "'><tr>";
    //text = text.slice(-1);
    if (primarySplit != "") {

      text = text.slice(0, -1);
      for (let i = 0; i < text.split(primarySplit).length; i++) {
        if (i == 0) {
          t1 = t1 + this.EncloseByField(text.split(primarySplit)[i], SecondarySplit, splitWidthIndividual) + "</tr>";
        }
        else {
          t1 = t1 + "<tr>" + this.EncloseByField(text.split(primarySplit)[i], SecondarySplit, splitWidthIndividual) + "</tr>";
        }
      }
      t1 = t1 + "</table>";
      //console.log(t1);
      return t1;
    }
    return text;
  }

  EncloseByField(text, splitBy, TDpercent) {
    var TdPercent = TDpercent.split(',');
    console.log(TdPercent);
    var t1 = "";
    if (splitBy != "") {
      for (let i = 0; i < text.split(splitBy).length; i++) {
        console.log(TDpercent);
        t1 = t1 + "<td align='left' width='" + TdPercent[i] + "'>" + text.split(splitBy)[i] + "</td>";
      }
    }
    else {
      return "<td align='left' width='" + TdPercent[0] + "'>" + text + "</td>";
    }
    return t1;
  }


  GetBottleLostStructure(data, parametername) {
    this.bottlelossStructure = "";
    this.bottlelossStructure = "<table width='100%'  class='table'><tr><td bgcolor='#99ff99'><h5>";
    if (data != null) {
      for (let j = 0; j < Object.keys(data['Bottle_loss'][parametername]).length; j++) {
        if (j === 0) {
          this.bottlelossStructure = this.bottlelossStructure + "<b></b>" + parametername.toUpperCase() + "</b> : " + data['Bottle_loss'][parametername]['total'] + "</h5></td></tr>";
        }
        if (Object.keys(data['Bottle_loss'][parametername])[j] != 'total') {
          this.bottlelossStructure = this.bottlelossStructure + "<tr><td><font color='#000080'>" + Object.keys(data['Bottle_loss'][parametername])[j].toUpperCase() + " : " + data['Bottle_loss'][parametername][Object.keys(data['Bottle_loss'][parametername])[j]]['total'] + "</font></td></tr>";
        }
        this.bottlelossStructure = this.bottlelossStructure + "<tr><td><ul>";
        for (let k = 0; k < Object.keys(data['Bottle_loss'][parametername][Object.keys(data['Bottle_loss'][parametername])[j]]).length; k++) {
          if (Object.keys(data['Bottle_loss'][parametername][Object.keys(data['Bottle_loss'][parametername])[j]])[k] != 'total') {
            this.bottlelossStructure = this.bottlelossStructure + "<li>" + Object.keys(data['Bottle_loss'][parametername][Object.keys(data['Bottle_loss'][parametername])[j]])[k] + " : "
              + data['Bottle_loss'][parametername][Object.keys(data['Bottle_loss'][parametername])[j]][Object.keys(data['Bottle_loss'][parametername][Object.keys(data['Bottle_loss'][parametername])[j]])[k]] + "</li>";
          }
        }
        this.bottlelossStructure = this.bottlelossStructure + "</ul></td></tr>";
      }
      this.bottlelossStructure = this.bottlelossStructure + "</table>";

      return (this.bottlelossStructure);
    }
  }

  getShiftData(Shiftdata) {
    this.httpClient.get('configs/apix/shift_end_data_pattern.json').subscribe(
      data => {
        this.ShiftDataParameters = data['table']['parameters'];
      }
    );
    for (let i = 0; i < Object.keys(this.ShiftDataParameters).length; i++) {
      var parameter = Object.keys(this.ShiftDataParameters)[i];
    }
  }

  getShiftDataParameters() {
    //Get Structure (pre-defined parameters/format) from JSON
  }
  ngOnInit() {
    this.createFormControlsShiftReportForm();
    this.createShiftReportForm();
  }

  emailpopup() {
    const dialogRef = this.dialog.open(ShiftEmailDailogComponent, {
      width: '300px',
      height: '300px',
      data: {
        dataKey: {
          emaildata: "<style type='text/css'>table {width: 100%;}tr {text-align: left;border: 1px solid black;}" +
            "th, td {padding: 10px;tr:nth-child(odd) {background: #CCC}tr:nth-child(even) {background: #FFF}.no-content {background-color: red;}</style><div>" + this.headerStructure + this.tablestructure + this.footStructure + this.shiftEndcomment + "</div>"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  public captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary settiddateng options
      var imgWidth = 208;
      //var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('ShiftEnd.pdf'); // Generated PDF
    });
  }
}


