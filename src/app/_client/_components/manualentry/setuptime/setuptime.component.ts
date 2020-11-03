import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface Setup {
  setupId: string;
  startSKU: string;
  endSKU: string;
  ChangeOvertime: string;
  CleaningTime: string;
  Setuptime: string
}

@Component({
  selector: 'app-setuptime',
  templateUrl: './setuptime.component.html',
  styleUrls: ['./setuptime.component.scss']
})

export class SetuptimeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() lineid: string;
  LineId;

  displayedColumns: string[] = [];
  displayedColumnsAs = {
    setupId: { 'DN': 'Setup Id', 'visible': true },
    startSKU: { 'DN': 'Start SKU', 'visible': false },
    endSKU: { 'DN': 'End SKU', 'visible': false },
    ChangeOvertime: { 'DN': 'ChangeOver Time', 'visible': true },
    Setuptime: { 'DN': 'Setuptime', 'visible': false },
    CleaningTime: { 'DN': 'Cleaning Time', 'visible': true }
  };

  gotData: boolean = false;
  vdisplayedColumns: string[];
  //dataSource = [];
  dataSource: MatTableDataSource<Setup>;
  EqID = [];
  Eqname = [];
  skuform: FormGroup;

  sku_id: FormControl;
  sku_number: FormControl;
  sku_name: FormControl;
  //line_id: FormControl;
  equipments: FormControl;
  rated_speed: FormControl;
  bpc: FormControl;
  min_weight_range: FormControl;
  max_weight_range: FormControl;

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormControlsSKU() {
    this.sku_id = new FormControl('');
    this.sku_number = new FormControl('', Validators.required);
    this.sku_name = new FormControl('', Validators.required);
    //this.line_id = new FormControl('', Validators.required);
    this.equipments = new FormControl('', Validators.required);
    this.rated_speed = new FormControl('', Validators.required);
    this.bpc = new FormControl('', Validators.required);
    this.min_weight_range = new FormControl('', Validators.required);
    this.max_weight_range = new FormControl('', Validators.required);
  }

  createSKUForm() {
    this.skuform = new FormGroup({
      sku_id: this.sku_id,
      sku_number: this.sku_number,
      sku_name: this.sku_name,
      //line_id: this.line_id,
      equipments: this.equipments,
      rated_speed: this.rated_speed,
      bpc: this.bpc,
      min_weight_range: this.min_weight_range,
      max_weight_range: this.max_weight_range
    });
  }
  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) {
  }

  // async GetCompanyID(lineid) {
  //   await this.httpClient.get('configs/apix/api_server.json').subscribe(
  //     apipath => {
  //       if (apipath['server'] !== undefined) {
  //         this.httpClient.get(apipath['server'] + '/api/manual/company').subscribe(
  //           (data: any[]) => {
  //             for (let i = 0; i < data.length; i++) {
  //               const company = data[i];
  //               company.countries.forEach(country => {
  //                 country.states.forEach(state => {
  //                   state.locations.forEach(location => {
  //                     location.plants.forEach(plant => {
  //                       plant.lines.forEach(line => {
  //                         if (lineid === line._id) {
  //                           //this.CompanyId = company._id;
  //                           this.GetequipmentData(company._id);
  //                           //return ;
  //                         }
  //                       });
  //                     });
  //                   });
  //                 });
  //               });
  //             }
  //           });
  //       }
  //     });
  // }

  // GetequipmentData(lineid) {
  //   this.Equipments = [];
  //   this.httpClient.get('configs/apix/api_server.json').subscribe(
  //     apipath => {
  //       if (apipath['server'] !== undefined) {
  //         this.httpClient.get(apipath['server'] + '/api/manual/equipment/' + lineid).subscribe(
  //           (data: any[]) => {
  //             for (let i = 0; i < data.length; i++) {
  //               const c = data[i];
  //               const Equipment_data =
  //               {
  //                 equipmentid: c._id,
  //                 lineid: c.line_id._id,
  //                 equipmentdisplayname: c.display_name,
  //               }
  //               this.Equipments.push(Equipment_data);
  //             }
  //           }
  //         )
  //       }
  //     }
  //   );
  // }

  // GetSKUdata(lineid) {
  //   this.SKUdata = [];
  //   this.httpClient.get('configs/apix/api_server.json').subscribe(
  //     apipath => {
  //       if (apipath['server'] !== undefined) {
  //         this.httpClient.get(apipath['server'] + '/api/manual/sku?line_id=' + lineid).subscribe(
  //           (data: any[]) => {

  //             ////----------------------need to change data.length----------------------------------------
  //             for (let i = 0; i < data.length; i++) {
  //               const c = data[i];
  //               const EqID = []
  //               const Eqname = [];
  //               for (let j = 0; j < data[i].equipments.length; j++) {
  //                 EqID.push(data[i].equipments[j]._id);
  //                 Eqname.push(data[i].equipments[j].display_name);
  //               }
  //               const sku_data =
  //               {
  //                 skuid: c._id,
  //                 skunumber: c.sku_number,
  //                 skuname: c.sku_name,
  //                 lineid: c.line_id

  //               }
  //               this.SKUdata.push(sku_data);
  //             }
  //             //this.vdisplayedColumns = [];
  //           }
  //         )
  //       }
  //     }
  //   );
  // }

  ngOnChanges(changes: SimpleChanges): void {
    this.LineId = changes.lineid.currentValue;
    //this.GetCompanyID(changes.lineid.currentValue);
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      //this.GetSKUdata(changes.lineid.currentValue);
      //this.GetequipmentData(changes.lineid.currentValue);
    }
  }

  ngOnInit() {
    this.createFormControlsSKU();
    this.createSKUForm();
    //if (this.LineId != null && this.LineId != "") {
    //this.GetSKUdata(this.LineId);
    //}
  }

  postFormData() {
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {

          const T = {
            _id: this.sku_id.value,
            sku_number: this.sku_number.value,
            sku_name: this.sku_name.value,
            line_id: this.LineId,//from @input value
            equipments: this.equipments.value,
            rated_speed: this.rated_speed.value,
            bpc: this.bpc.value,
            min_weight_range: this.min_weight_range.value,
            max_weight_range: this.max_weight_range.value
          }
          this.httpClient.post(apipath['server'] + '/api/manual/sku', T).subscribe(
            (data: any[]) => {
              this.openSnackBar("Success", "Records has been added/updated successfully");
              //this.GetSKUdata(this.LineId);//This.lineid is @input parameter.
              this.skuform.reset();
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

  updateRow(element) {
    this.skuform.patchValue({
      sku_id: element.skuid,
      sku_number: parseInt(element.skunumber),
      sku_name: element.skuname,
      line_id: element.lineid,
      equipments: element.equipmentsid,
      rated_speed: element.ratedspeed,
      bpc: parseInt(element.bpc),
      min_weight_range: parseInt(element.minweightrange),
      max_weight_range: parseInt(element.maxweightrange)
    });
  }

  deleteRow(element) {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
