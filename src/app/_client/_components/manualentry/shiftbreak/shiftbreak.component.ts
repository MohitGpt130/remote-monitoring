import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-shiftbreak',
  templateUrl: './shiftbreak.component.html',
  styleUrls: ['./shiftbreak.component.scss']
})
export class ShiftbreakComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  dataSource = [];

  displayedColumnsAs = {
    SelShiftName:'Shift Name',
    pdt_start:'PDT Start Time',
    pdt_end:'PDT End Time',
  };


  Shifts: string[] = ['Shift A', 'Shift B'];
  constructor(
    private httpClient: HttpClient
  ) {
  }
  //---------------------------------------------------------SHIFT Break------------------------------------------------
  shiftbreak: FormGroup;
  SelShiftName: FormControl;
  pdt_start: FormControl;
  pdt_end: FormControl;

  createFormControlsShiftBreak() {
    this.SelShiftName = new FormControl('', Validators.required);
    this.pdt_start = new FormControl('', Validators.required);
    this.pdt_end = new FormControl('', Validators.required);
  }

  createShiftBreakForm() {
    this.shiftbreak = new FormGroup({
      SelShiftName: this.SelShiftName,
      pdt_start: this.pdt_start,
      pdt_end: this.pdt_end
    });
  }

  ngOnInit() {
    this.createFormControlsShiftBreak();
    this.createShiftBreakForm();

    this.httpClient.get('configs/apix/shiftbreakdata.json').subscribe(
      (data: any[]) => {
        console.log(data);
        this.vdisplayedColumns = [];
        for (let i = 0; i < Object.keys(data[0]).length; i++) {
          console.log(Object.keys(data[0])[i]);
          this.vdisplayedColumns.push(Object.keys(data[0])[i]);
        }

        this.vdisplayedColumns.push('star');
        this.vdisplayedColumns.push('delete');

        this.gotData = true;
        this.dataSource = data;
        this.displayedColumns = this.vdisplayedColumns;
      }
    )
  }
  updateRow(element) {
    console.log(element);
    this.shiftbreak.patchValue({
      SelShiftName: element.SelShiftName,
      pdt_start: element.pdt_start,
      pdt_end: element.pdt_end
    });
  }
  deleteRow(element){

  }
}
