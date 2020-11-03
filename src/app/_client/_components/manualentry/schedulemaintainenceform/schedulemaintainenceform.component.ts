import { NgModule,Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-schedulemaintainenceform',
  templateUrl: './schedulemaintainenceform.component.html',
  styleUrls: ['./schedulemaintainenceform.component.scss']
})

export class SchedulemaintainenceformComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  dataSource = [];
  displayedColumnsAs = {
    maintainence_start_date: 'Maintainence Start Date',
    maintainence_start_time: 'Maintainence Start Time',
    maintainence_end_date: 'Maintainence End Date',
    maintainence_end_time: 'Maintainence End Time'
  }

  schedulemaintainenceform: FormGroup;
  maintainence_start_date: FormControl;
  maintainence_start_time: FormControl;
  maintainence_end_date: FormControl;
  maintainence_end_time: FormControl;

  createFormControlsMaintainenceoff() {
    this.maintainence_start_date = new FormControl('', Validators.required);
    this.maintainence_start_time = new FormControl('', Validators.required);

    this.maintainence_end_date = new FormControl('', Validators.required);
    this.maintainence_end_time = new FormControl('', Validators.required);
  }

  createMaintainenceOffForm() {
    this.schedulemaintainenceform = new FormGroup({
      maintainence_start_date: this.maintainence_start_date,
      maintainence_start_time: this.maintainence_start_time,
      maintainence_end_date: this.maintainence_end_date,
      maintainence_end_time: this.maintainence_end_time
    });
  }

  constructor(
    private httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.createFormControlsMaintainenceoff();
    this.createMaintainenceOffForm();

    this.httpClient.get('configs/apix/schedulemaintainence.json').subscribe(
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

  updateRow(element){
    console.log(element);
    this.schedulemaintainenceform.patchValue({
      maintainence_start: element.maintainence_start,
      maintainence_end: element.maintainence_end
    });
  }
  deleteRow(element){

  }
}
