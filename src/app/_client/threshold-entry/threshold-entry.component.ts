import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-threshold-entry',
  templateUrl: './threshold-entry.component.html',
  styleUrls: ['./threshold-entry.component.scss']
})
export class ThresholdEntryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
