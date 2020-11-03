import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


export interface Company {
  companyid: string;
  companyname: string;
}

export interface Country {
  countryid: string;
  countryname: string;
}

export interface StateData {
  companyid: string;
  companyname: string;
  countryid: string;
  countryname: string;
  stateid: string;
  statecode: string;
  statename: string;
}

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})

export class StateComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) { }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  displayedColumns: string[];// = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  //dataSource = [];
  dataSource: MatTableDataSource<StateData>;

  companydata;
  displayedColumnsAs = {
    companyid: { 'DN':'Company Id', 'visible': true },
    companyname:{ 'DN': 'Company Name', 'visible': false },
    countryid: { 'DN':'Country Id', 'visible': true },
    countryname: { 'DN':'Country Name', 'visible': false },
    stateid:{ 'DN': 'State ID', 'visible': true },
    statecode:{ 'DN': 'State Code', 'visible': false },
    statename: { 'DN':'State Name', 'visible': false }
  }

  tableData = [];
  //Used from dropown
  public Companies: Company[] = [];
  public Countries: Country[] = [];
  public Statesdata: StateData[] = [];

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  stateform: FormGroup;
  //3 formcontrols used in page as below


  _id: FormControl;
  company_id: FormControl;
  country_id: FormControl;
  state_code: FormControl;
  state_name: FormControl;

  createFormControlscountry() {
    this._id = new FormControl('');
    this.company_id = new FormControl('', Validators.required);
    this.country_id = new FormControl('', Validators.required);
    this.state_code = new FormControl('', Validators.required);
    this.state_name = new FormControl('', Validators.required);
  }

  createstateform() {
    this.stateform = new FormGroup({
      _id: this._id,
      company_id: this.company_id,
      country_id: this.country_id,
      state_code: this.state_code,
      state_name: this.state_name
    });
  }

  GetCountriesList(cid) {
    for (let i = 0; i < Object.keys(this.companydata).length; i++) {
      if (this.companydata[i]._id === cid) {
        this.Countries = [];
        if (this.companydata[i].countries !== null) {
          for (const d of (this.companydata[i].countries as any)) {
            this.Countries.push({
              countryid: d._id,
              countryname: d.country_name
            });
          }
          return (this.Countries);
        }
      }
    }
  }

  GetStateData() {
    this.Statesdata =[];
    this.Companies =[];

    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/company').subscribe(
            (data: any[]) => {
              this.companydata = data;
              for (let i = 0; i < data.length; i++) {
                const company = data[i]
                company.countries.forEach(country => {
                  country.states.forEach(state => {
                    const data = {};
                    const ELEMENT_DATA =
                    {
                      companyid: company._id,
                      companyname: company.company_name,
                      countryid: country._id,
                      countryname: country.country_name,
                      stateid: state._id,
                      statecode: state.state_code,
                      statename: state.state_name
                    }
                    this.Statesdata.push(ELEMENT_DATA);
                  });
                });
              }
              for (const
                d of (data as any)) {
                this.Companies.push({
                  companyid: d._id,
                  companyname: d.company_name
                });
              }
              this.vdisplayedColumns = [];
              if (Object.keys(this.Statesdata).length > 0) {
                for (let i = 0; i < Object.keys(this.Statesdata[0]).length; i++) {
                  this.vdisplayedColumns.push(Object.keys(this.Statesdata[0])[i]);
                }
                //}
                this.vdisplayedColumns.push('star');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.Statesdata);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.displayedColumns = this.vdisplayedColumns;
              }
            }
          )
        }
      }
    );
  }

  ngOnInit() {
    this.createFormControlscountry();
    this.createstateform();
    this.GetStateData();
  }

  ClearElements() {
    this._id.setValue("");
    //this.cause_name.setValue
  }

  poststateData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.post(apipath['server'] + '/api/manual/state', this.stateform.value).subscribe(
            (data: any[]) => {
              this.openSnackBar("Success", "Records has been added/updated successfully");
              this.GetStateData();
              this.stateform.reset();
            },
            (error: HttpErrorResponse) => {
              if (error.status == 409) {
                this.openSnackBar("Validation", "Duplicate record found");
              }
              else {
                this.openSnackBar("Error", error.error);
              }
            }
          );
        }
      });
  }
  deleteRow(element) {

  }

  updateRow(element) {
    this.GetCountriesList(element.companyid);
    this.stateform.patchValue({
      _id: element.stateid,
      company_id: element.companyid,
      country_id: element.countryid,
      state_code: element.statecode,
      state_name: element.statename
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
