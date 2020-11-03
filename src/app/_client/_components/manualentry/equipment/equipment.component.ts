import { ManualEntryService } from './../../manual-entry.service';

import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
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

interface Equipment {
  equipmentid: string,
  //companyid: string,
  //companyname: string,
  equipmentname: string,
  equipmentdisplayname: string,
  type: string
}

// interface Company {
//   companyid: string,
//   companyname: string,
// }

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})

export class EquipmentComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar,private manualentryservice:ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  //public Companies: Company[] = [];
  @Input() lineid: string;
  public Equipments: Equipment[] = [];
  displayedColumns: string[];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  //dataSource = [];
  dataSource: MatTableDataSource<Equipment>;
  displayedColumnsAs = {
    equipmentid: { 'DN':'Equipment ID', 'visible': true },
    //companyid: 'Company Id',
    //companyname: 'Company Name',
    equipmentname: { 'DN':'Equipment Code', 'visible': false },
    equipmentdisplayname: { 'DN':'Equipment Display Name', 'visible': false },
    type: { 'DN':'Type', 'visible': true }
  }
  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  equipmentform: FormGroup;
  //3 formcontrols used in page as below
  _id: FormControl;
  //company_id: FormControl;
  equipment_name: FormControl;
  display_name: FormControl;
  product: FormControl;

  //For machines names
  Machines: string[];
  allmachines;

  //For machine states
  allmachinestates;
  States;

  createFormControlsequipment() {
    this._id = new FormControl('');
    //this.company_id = new FormControl('', Validators.required);
    this.equipment_name = new FormControl('', Validators.required);
    this.display_name = new FormControl('', Validators.required);
    this.product = new FormControl('', Validators.required);
  }

  createequipmentForm() {
    this.equipmentform = new FormGroup({
      _id: this._id,
      //company_id: this.company_id,
      equipment_name: this.equipment_name,
      display_name: this.display_name,
      product: this.product
    });
  }

  // GetcompanyData() {
  //   this.Companies = [];
  //   //this.Countrydata = [];
  //   this.httpClient.get('configs/apix/api_server.json').subscribe(
  //     apipath => {
  //       if (apipath['server'] !== undefined) {
  //         this.httpClient.get(apipath['server'] + '/api/manual/company').subscribe(
  //           (data: any[]) => {
  //             for (const
  //               d of (data as any)) {
  //               //console.log(d._id, d.company_id);
  //               this.Companies.push({
  //                 companyid: d._id,
  //                 companyname: d.company_name
  //               });
  //             }
  //           }
  //         )
  //       }
  //     }
  //   );
  // }

  GetequipmentData(lineid) {
    this.Equipments = [];
    this.manualentryservice.GetServerAPIPath().subscribe(
    //this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.manualentryservice.GetEquipmentdata(lineid, apipath['server'],'all').subscribe(
          //this.httpClient.get(apipath['server'] + '/api/manual/equipment/' + lineid).subscribe(
            (data: any[]) => {
              //console.log(apipath['machines'][Object.keys(apipath['machines'])]);
              //console.log(Object.keys(data).length);
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const Equipment_data =
                {
                  equipmentid: c._id,
                  equipmentname: c.equipment_name,
                  equipmentdisplayname: c.display_name,
                  type: c.product
                }
                this.Equipments.push(Equipment_data);
              }
              console.log(this.Equipments);
              this.vdisplayedColumns = [];
              if (Object.keys(data).length > 0) {
                for (let i = 0; i < Object.keys(this.Equipments[0]).length; i++) {
                  this.vdisplayedColumns.push(Object.keys(this.Equipments[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                this.gotData = true;
                this.dataSource = new MatTableDataSource(this.Equipments);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.displayedColumns = this.vdisplayedColumns;
              }
              else
              {
                console.log('else part called');
                this.gotData = true;
                this.dataSource = null;
                this.displayedColumns = this.vdisplayedColumns;
              }
            })
        }
      });
  }

  ngOnInit() {
    this.createFormControlsequipment();
    this.createequipmentForm();
    //this.GetcompanyData()
    //console.log(this.lineid);
    // if (this.lineid != null && this.lineid != "") {
    //   this.GetequipmentData(this.lineid);
    // }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    //console.log('on change', changes);
    //console.log(changes.lineid.currentValue);

    this.lineid = changes.lineid.currentValue;
    //console.log(changes.lineid.currentValue);
    //this.GetCompanyID(changes.lineid.currentValue)
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      //console.log(this.manualentryservice.GetequipmentData(changes.lineid.currentValue));
      //console.log(this.GetequipmentData(changes.lineid.currentValue));
      this.GetequipmentData(changes.lineid.currentValue);
    }
  }

  ClearElements() {
    this._id.setValue("");
    //this.display_name.setValue
  }

  postequipmentData() {
    //console.log(this.equipmentform.value);
    //console.log(this.equipmentform.valid);
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          //console.log(this.equipmentform.value);
          const T = {
            _id: this._id.value,
            equipment_name: this.equipment_name.value,
            display_name: this.display_name.value,
            line_id: this.lineid,
            product: this.product.value
          }
          console.log(T);
          this.httpClient.post(apipath['server'] + '/api/manual/equipment', T).subscribe(
            (data: any[]) => {
              console.log(data);
              this.openSnackBar("Success", "Records has been added/updated successfully");
              this.GetequipmentData(this.lineid);

              this.equipmentform.reset();
            },
            (error: HttpErrorResponse) => {
              this.gotData = true;
              if (error.status == 409) {
                //this.httpErrorService.onError(error);
                this.openSnackBar("Validation", error.error);

              }
              else if (error.status == 404) {
                //this.httpErrorService.onError(error);
                //this.openSnackBar("Validation", error.error);
               console.log('asdfsdf')
                this.dataSource = null;
              }

              else {
                this.openSnackBar("Error", error.error);
              }
            }
          );
        }
      });
  }

  updateRow(element) {
    console.log(element);
    this.equipmentform.patchValue({
      _id: element.equipmentid,
      //company_id: element.companyid,
      equipment_name: element.equipmentname,
      display_name: element.equipmentdisplayname,
      product: element.type
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
