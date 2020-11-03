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
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface Changeover {
  changeoverid: string;
  changeover_type_id: string;
  changeover_type_name: string;
  batchname: string;
  batchsize: string;
  productid: string;
  fgex: string;
  changeoverstartdate: string;
  changeoverenddate: string;
  type: string
}

interface ChangeoverType {
  ChangeoverTypeID: string;
  ChangeoverTypeName: string;
}

interface FGex {
  FGexID: string;
  FGexValue: string;
}

interface Product {
  ProductID: string;
  ProductName: string;
}

@Component({
  selector: 'app-change-over1',
  templateUrl: './change-over1.component.html',
  styleUrls: ['./change-over1.component.scss']
})

export class ChangeOver1Component implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  title:string="Changeover Process";
  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, private manualentryservice: ManualEntryService) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  //public Companies: Company[] = [];
  @Input() lineid: string;

  public Changeover: Changeover[] = [];
  //All 3 Dropdown List.
  public Products: Product[] = [];
  public FGex: FGex[] = [];
  public ChangeoverType: ChangeoverType[] = [];

  displayedColumns: string[];
  gotData: boolean = false;
  vdisplayedColumns: string[];
  //dataSource = [];
  dataSource: MatTableDataSource<Changeover>;
  displayedColumnsAs = {
    equipmentid: { 'DN': 'Equipment ID', 'visible': true },
    //companyid: 'Company Id',
    //companyname: 'Company Name',
    equipmentname: { 'DN': 'Equipment Code', 'visible': false },
    equipmentdisplayname: { 'DN': 'Equipment Display Name', 'visible': false },
    type: { 'DN': 'Type', 'visible': true }
  }
  HideColumnsAs: string[] = ['_id', '__v'];
  getDisplayedColumns() {
    return this.displayedColumnsAs;
  }

  changeoverForm: FormGroup;

  changeover_type_id: FormControl;
  batch_name: FormControl;
  batch_size: FormControl;
  product_id: FormControl;
  fgex:FormControl;
  //For machines names
  Machines: string[];
  allmachines;

  //For machine states
  allmachinestates;
  States;

  createFormControlsequipment() {
    this.changeover_type_id = new FormControl('');
    this.batch_name = new FormControl('', Validators.required);
    this.batch_size = new FormControl('', Validators.required);
    this.product_id = new FormControl('', Validators.required);
    this.fgex = new FormControl('', Validators.required);
  }

  createchangeoverForm() {
    this.changeoverForm = new FormGroup({
      changeover_type_id: this.changeover_type_id,
      batch_name: this.batch_name,
      batch_size: this.batch_size,
      product_id: this.product_id,
      fgex:this.fgex
    });
  }

  GetChangeoverDetails(lineid) {
    this.Changeover = [];
    this.FGex=[];
    this.Products=[];
    this.manualentryservice.GetServerAPIPath().subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.manualentryservice.GetChangeOverData(apipath['server']).subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const ChangeoverType_data =
                {
                  ChangeoverTypeName: c.changeover_type + ' ' + c.changeover_name,
                  ChangeoverTypeID: c._id
                }
                this.ChangeoverType.push(ChangeoverType_data);
              }
            });

          this.manualentryservice.GetFgexData(apipath['server']).subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const Fgex_data =
                {
                  FGexID: c.fgex,
                  FGexValue: c.fgex
                }
                this.FGex.push(Fgex_data);
              }
            });

            this.manualentryservice.GetFgexData(apipath['server']).subscribe(
              (data: any[]) => {
                for (let i = 0; i < data.length; i++) {
                  const c = data[i];
                  const Product_data =
                  {
                    ProductID: c._id,
                    ProductName: c.product_name
                  }
                  this.Products.push(Product_data);
                }
              });
        }
      });
  }

  ngOnInit() {
    this.createFormControlsequipment();
    this.createchangeoverForm();

    //this.GetcompanyData()
    // if (this.lineid != null && this.lineid != "") {
    //   this.GetequipmentData(this.lineid);
    // }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    this.lineid = changes.lineid.currentValue;
    //this.GetCompanyID(changes.lineid.currentValue)
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      this.GetChangeoverDetails(changes.lineid.currentValue);
    }
  }

  // ClearElements() {
  //   this._id.setValue("");
  //   //this.display_name.setValue
  // }

  postequipmentData() {
    // this.httpClient.get('configs/apix/api_server.json').subscribe(
    //   apipath => {
    //     if (apipath['server'] !== undefined) {
    //       const T = {
    //         _id: this._id.value,
    //         equipment_name: this.equipment_name.value,
    //         display_name: this.display_name.value,
    //         line_id: this.lineid,
    //         product: this.product.value
    //       }
    //       this.httpClient.post(apipath['server'] + '/api/manual/equipment', T).subscribe(
    //         (data: any[]) => {
    //           this.openSnackBar("Success", "Records has been added/updated successfully");
    //           this.GetChangeoverDetails(this.lineid);

    //           this.changeoverForm.reset();
    //         },
    //         (error: HttpErrorResponse) => {
    //           this.gotData = true;
    //           if (error.status == 409) {
    //             //this.httpErrorService.onError(error);
    //             this.openSnackBar("Validation", error.error);

    //           }
    //           else if (error.status == 404) {
    //             //this.httpErrorService.onError(error);
    //             //this.openSnackBar("Validation", error.error);
    //             this.dataSource = null;
    //           }

    //           else {
    //             this.openSnackBar("Error", error.error);
    //           }
    //         }
    //       );
    //     }
    //   });
  }

  updateRow(element) {
    // this.changeoverForm.patchValue({
    //   _id: element.equipmentid,
    //   //company_id: element.companyid,
    //   equipment_name: element.equipmentname,
    //   display_name: element.equipmentdisplayname,
    //   product: element.type
    // });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ChangeOverStart()
  {

  }
}
