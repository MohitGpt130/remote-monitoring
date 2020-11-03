//import { Company } from './../country/country.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

export interface company {
  companyid: string,
  companycode: string,
  companyname: string
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

export class CompanyComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public CompanyData: company[] = [];
  displayedColumns: string[];// = ['position', 'name', 'weight', 'symbol'];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  dataSource: MatTableDataSource<company>;

  //dataSource = [];

  displayedColumnsAs = {
    companyid: { 'DN': 'ID', 'visible': true },
    companycode: { 'DN': 'Company Code', 'visible': false },
    companyname: { 'DN': 'Company Name', 'visible': false }
  }

  //HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  companyform: FormGroup;
  //3 formcontrols used in page as below
  _id: FormControl;
  company_name: FormControl;
  company_code: FormControl;


  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) { }
  openSnackBar(message: string, action: string) {


    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  ngOnInit() {
    this.createFormControlscompany();
    this.createcompanyForm();
    this.GetcompanyData();

  }
  createFormControlscompany() {
    this._id = new FormControl('');

    this.company_code = new FormControl('', Validators.required);
    this.company_name = new FormControl('', Validators.required);
  }

  createcompanyForm() {
    this.companyform = new FormGroup({
      _id: this._id,
      company_code: this.company_code,
      company_name: this.company_name
    });
  }

  GetcompanyData() {
    this.CompanyData = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {

          this.httpClient.get(apipath['server'] + '/api/manual/company').subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const company_data =
                {
                  companyid: c._id,
                  companycode: c.company_code,
                  companyname: c.company_name
                }
                this.CompanyData.push(company_data);
              }
              //console.log(this.Equipments);
              this.vdisplayedColumns = [];
              //console.log(Object.keys(data[0]).length);
              if (Object.keys(data).length > 0) {
                for (let i = 0; i < Object.keys(this.CompanyData[0]).length; i++) {
                  //console.log(Object.keys(this.Equipments[0])[i]);
                  this.vdisplayedColumns.push(Object.keys(this.CompanyData[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                //this.vdisplayedColumns.push('delete');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.CompanyData);
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



  ClearElements() {
    this._id.setValue("");
    //this.cause_name.setValue
  }

  postcompanyData() {
    this.gotData =false;
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          console.log(this.companyform.value);
          this.httpClient.post(apipath['server'] + '/api/manual/company', this.companyform.value).subscribe(
            (data: any[]) => {
              //this.openSnackBar("Success", "Records has been added/updated successfully");
              console.log(data);
              this.GetcompanyData();
              this.companyform.reset();
            },
            (error: HttpErrorResponse) => {
              if (error.status == 409) {
                this.openSnackBar("Validation", "This record is duplicate, kindly update it");
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
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  updateRow(element) {
    console.log(element)
    this.companyform.patchValue({
      _id: element.companyid,
      company_name: element.companyname,
      company_code: element.companycode
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
