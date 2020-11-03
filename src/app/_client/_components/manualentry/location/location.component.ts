import { filter } from 'rxjs/operators';
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

export interface State {
  stateid: string;
  statename: string;
}
export interface LocationData {
  companyid: string;
  companyname: string;
  countryid: string;
  countryname: string;
  stateid: string;
  statename: string;
  locationid: string;
  locationcode: string;
  locationname: string;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})

export class LocationComponent implements OnInit {
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
  dataSource: MatTableDataSource<LocationData>;

  companydata;
  displayedColumnsAs = {
    companyid: { 'DN': 'Company Id', 'visible': true },
    companyname: { 'DN': 'Company Name', 'visible': false },
    countryid: { 'DN': 'Country Id', 'visible': true },
    countryname: { 'DN': 'Country Name', 'visible': false },
    stateid: { 'DN': 'State ID', 'visible': true },
    statecode: { 'DN': 'State Code', 'visible': true },
    statename: { 'DN': 'State Name', 'visible': false },
    locationid: { 'DN': 'Location Id', 'visible': true },
    locationcode: { 'DN': 'Location Code', 'visible': false },
    locationname: { 'DN': 'Location Name', 'visible': false }
  }

  tableData = [];
  //Used from dropown
  public Companies: Company[] = [];
  public Countries: Country[] = [];
  public States: State[] = [];
  public LocationsData: LocationData[] = [];

  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  locationform: FormGroup;
  //3 formcontrols used in page as below

  _id: FormControl;//ID for Location
  company_id: FormControl;
  country_id: FormControl;
  state_id: FormControl;
  location_code: FormControl;
  location_name: FormControl;

  createFormControlscountry() {
    this._id = new FormControl('');
    this.company_id = new FormControl('', Validators.required);
    this.country_id = new FormControl('', Validators.required);
    this.state_id = new FormControl('', Validators.required);
    this.location_code = new FormControl('', Validators.required);
    this.location_name = new FormControl('', Validators.required);
  }

  createlocationform() {
    this.locationform = new FormGroup({
      _id: this._id,
      company_id: this.company_id,
      country_id: this.country_id,
      state_id: this.state_id,
      location_code: this.location_code,
      location_name: this.location_name
    });
  }

  GetCountriesList(cid) {
    //console.log(cid);
    //console.log(Object.keys(this.companydata).length);
    for (let i = 0; i < Object.keys(this.companydata).length; i++) {
      //console.log(this.companydata[i]._id);
      //console.log(this.company_id.value);
      if (this.companydata[i]._id === cid) {
        //console.log(this.companydata[i].countries);
        this.Countries = [];
        //console.log(Object.keys(this.companydata[i].countries).length);
        if (this.companydata[i].countries !== null) {
          for (const d of (this.companydata[i].countries as any)) {
            //console.log(d._id, d.country_name);
            this.Countries.push({
              countryid: d._id,
              countryname: d.country_name
            });
          }
          //console.log(this.Countries);
          return (this.Countries);
        }
      }
    }
  }

  GetStatesList(countryid) {
    //console.log(countryid);
    this.States = [];
    for (let i = 0; i < this.companydata.length; i++) {
      const company = this.companydata[i]
      //console.log(company);
      company.countries.forEach(country => {
        country.states.forEach(state => {
          if (state.country_id === countryid) {
            //console.log(state);
            const state_data =
            {
              stateid: state._id,
              statename: state.state_name
            }
            this.States.push(state_data);
          }
        });
      });
      //console.log(this.States);
    }
  }

  GetcountryData() {
    this.LocationsData = [];
    this.Companies = [];
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
                  country.states.forEach(state => {
                    state.locations.forEach(location => {
                      //console.log(state)
                      const data = {};
                      const ELEMENT_DATA =
                      {
                        companyid: company._id,
                        companyname: company.company_name,
                        countryid: country._id,
                        countryname: country.country_name,
                        stateid: state._id,
                        statename: state.state_name,
                        locationid: location._id,
                        locationcode: location.location_code,
                        locationname: location.location_name
                      }
                      this.LocationsData.push(ELEMENT_DATA);
                    });
                  });
                });
              }
              //console.log(this.LocationsData);
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
              //console.log(Object.keys(this.LocationsData[0]).length);
              if (Object.keys(this.LocationsData).length > 0) {
                // console.log(this.LocationsData);
                // console.log(Object.keys(this.LocationsData[0]).length);
                for (let i = 0; i < Object.keys(this.LocationsData[0]).length; i++) {
                  //if (typeof this.LocationsData[i][Object.keys(this.LocationsData[0])[i]] === 'string') {
                  //console.log(Object.keys(this.LocationsData[0])[i]);
                  this.vdisplayedColumns.push(Object.keys(this.LocationsData[0])[i]);
                }
                //}
                //console.log(this.vdisplayedColumns);
                this.vdisplayedColumns.push('star');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.LocationsData);
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
    this.createlocationform();
    this.GetcountryData();
  }

  ClearElements() {
    this._id.setValue("");
    //this.cause_name.setValue
  }

  poststateData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          console.log(this.locationform.value);
          this.httpClient.post(apipath['server'] + '/api/manual/location', this.locationform.value).subscribe(
            (data: any[]) => {
              this.openSnackBar("Success", "Records has been added/updated successfully");
              console.log(data);
              this.GetcountryData();
              this.locationform.reset();
            },
            (error: HttpErrorResponse) => {
              if (error.status == 409) {
                this.openSnackBar("Validation", error.error);
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
    //console.log(element)
    this.GetCountriesList(element.companyid);
    this.GetStatesList(element.countryid);
    this.locationform.patchValue({
      _id: element.locationid,
      company_id: element.companyid,
      country_id: element.countryid,
      state_id: element.stateid,
      location_code: element.locationcode,
      location_name: element.locationname
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
