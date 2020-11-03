import { Country } from './../state/state.component';
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

export interface company {
  companyid: string;
  companyname: string;
}
export interface country {
  countryid: string,
  countryname: string,
  countrycode: string;
}
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})

export class CountryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
  dataSource: MatTableDataSource<country>;
  displayedColumnsAs = {
    companyname: { 'DN': 'Company Name', 'visible': false },
    countrycode: { 'DN': 'Country Code', 'visible': false },
    countryname: { 'DN': 'Country Name', 'visible': false },
    countryid: { 'DN': 'Country ID', 'visible': true },
    companyid: { 'DN': 'Company ID', 'visible': true }
  }
  companydata;

  //Used from dropown

  public Companies: company[] = [];
  public Countrydata: country[] = [];

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  countryform: FormGroup;
  //3 formcontrols used in page as below
  company_id: FormControl;

  _id: FormControl;
  country_code: FormControl;
  country_name: FormControl;

  createFormControlscountry() {
    this._id = new FormControl('');
    this.company_id = new FormControl('', Validators.required);
    this.country_code = new FormControl('', Validators.required)
    this.country_name = new FormControl('', Validators.required);
  }
  public whitespacecontrol(control: FormControl): { [s: string]: boolean } {
    console.log('whitespacecontrol')
    if (control.value != null) {
      if (control.value.indexOf(' ') != -1) {
        console.log(true);
        return { 'whitespace': true };
      }
    }

    return null;
  }

  createcountryForm() {
    this.countryform = new FormGroup({
      _id: this._id,
      company_id: this.company_id,
      country_code: this.country_code,
      country_name: this.country_name
    });
  }

  GetcountryData() {
    this.Companies = [];
    this.Countrydata = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/company').subscribe(
            (data: any[]) => {
              this.companydata = data;
              for (let i = 0; i < data.length; i++) {
                const company = data[i]
                //console.log(company);
                company.countries.forEach(country => {
                  //console.log(country)
                  const data = {};
                  const ELEMENT_DATA =
                  {
                    companyid: company._id,
                    companyname: company.company_name,
                    countryid: country._id,
                    countrycode: country.country_code,
                    countryname: country.country_name
                  }
                  this.Countrydata.push(ELEMENT_DATA);
                });
              }
              //console.log(this.Countrydata);
              for (const
                d of (data as any)) {
                //console.log(d._id, d.company_id);
                this.Companies.push({
                  companyid: d._id,
                  companyname: d.company_name
                });
                //console.log(d.company_id);
              }
              //console.log(data[0].countries[0]);
              this.vdisplayedColumns = [];
              //console.log(Object.keys(this.Countrydata[0]).length);
              if (Object.keys(this.Countrydata).length > 0) {
                for (let i = 0; i < Object.keys(this.Countrydata[0]).length; i++) {
                  this.vdisplayedColumns.push(Object.keys(this.Countrydata[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.Countrydata);
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
    this.createcountryForm();
    this.GetcountryData();
  }

  ClearElements() {
    this._id.setValue("");
    //this.cause_name.setValue
  }

  postcountryData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          console.log(this.countryform.value);
          this.httpClient.post(apipath['server'] + '/api/manual/country', this.countryform.value).subscribe(
            (data: any[]) => {
              //this.openSnackBar("Success", "Records has been added/updated successfully");
              console.log(data);
              this.GetcountryData();
              this.countryform.reset();
            },
            (error: HttpErrorResponse) => {
              if (error.status == 409) {
                this.openSnackBar("Validation", "Duplicate record found, Retry with differnet values");
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
    console.log(element)
    this.countryform.patchValue({
      _id: element.countryid,
      company_id: element.companyid,
      country_code: element.countrycode,
      country_name: element.countryname

    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
