import { ManualEntryService } from './../../manual-entry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Component, OnInit, Input, SimpleChanges, ɵConsole, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SkuformdailogComponent } from './skuformdailog/skuformdailog.component';
interface Line {
  lineid: string;
  linename: string;
}
interface Machine {
  machineid: string;
  machinename: string;
}
interface Equipment {
  equipmentid: string;
  lineid: string;
  equipmentdisplayname: string;
}
interface Format {
  formatid: string;
  formatname: string;

}
interface designations {
  designationid: string;
  designationdisplayname: string;
}
interface SKU {
  skuid: string;
  skunumber: string;
  skuname: string;
  lineid: string;
  linename: string;
  equipments: string[];
  equipmentsid: string[];
  ratedspeed: string;
  bpc: string;
  minweightrange: string;
  maxweightrange: string;

  reliver: string;
  designationsid: string[];
  designations: string[];
  group: string;
  bottleneck: string;
  //bpm: string;
  cpp: string;
  speedpershift: string;
  standardspeed: string;
  formatid: string[];
  formatname: string[];

  changover_start_calculation_minute: string;
  production_start_calculation_minute: string;
}
@Component({
  selector: 'app-skuform',
  templateUrl: './skuform.component.html',
  styleUrls: ['./skuform.component.scss']
})

export class SkuformComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() lineid: string;
  LineId;
  //CompanyId;
  Machines: Machine[] = [];
  public SKUdata: SKU[] = [];
  public Equipments: Equipment[] = [];
  public Designations: designations[] = [];
  public Formats: Format[] = [];

  displayedColumns: string[] = [];
  displayedColumnsAs = {

    skuid: { 'DN': 'sku id', 'visible': true },
    skunumber: { 'DN': 'Product Number', 'visible': false },
    skuname: { 'DN': 'Product Name', 'visible': false },
    group: { 'DN': 'Group', 'visible': true },
    lineid: { 'DN': 'Line', 'visible': true },
    linename: { 'DN': 'Line', 'visible': true },

    equipments: { 'DN': 'Equipments Name', 'visible': true },
    equipmentsid: { 'DN': 'Equipments ID', 'visible': true },
    ratedspeed: { 'DN': 'Rated Speed', 'visible': true },
    bpc: { 'DN': 'BPC', 'visible': true },
    minweightrange: { 'DN': 'SKU Weight From', 'visible': true },

    maxweightrange: { 'DN': 'SKU Weight To', 'visible': true },
    reliver: { 'DN': 'Reliver', 'visible': true },
    designationsid: { 'DN': 'Man Power Id', 'visible': true },
    designations: { 'DN': 'Manpower', 'visible': true },

    formatid: { 'DN': 'Format ID', 'visible': true },
    formatname: { 'DN': 'Format Name', 'visible': false },

    bottleneck: { 'DN': 'Bottle Neck', 'visible': true },
    //bpm: { 'DN': 'BPM', 'visible': false },
    cpp: { 'DN': 'cpp', 'visible': true },
    speedpershift: { 'DN': 'Speed per shift', 'visible': true },
    standardspeed: { 'DN': 'Standard Speed', 'visible': true },
    changover_start_calculation_minute: { 'DN': 'Changeover Start', 'visible': true },
    production_start_calculation_minute: { 'DN': 'Production Start', 'visible': true }
  };

  gotData: boolean = false;
  vdisplayedColumns: string[];
  //dataSource = [];
  dataSource: MatTableDataSource<SKU>;
  EqID = [];
  Eqname = [];

  DesigID = [];
  Designame = [];

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, public dialog: MatDialog,
    private manualentryservice: ManualEntryService) {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  GetequipmentData(lineid) {
    this.Equipments = [];
    this.Designations = [];
    this.Formats = [];
    this.manualentryservice.GetServerAPIPath().subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.manualentryservice.GetEquipmentdata(lineid, apipath['server'], 'machine').subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const Equipment_data =
                {
                  equipmentid: c._id,
                  lineid: c.line_id._id,
                  equipmentdisplayname: c.display_name,
                }
                this.Equipments.push(Equipment_data);
              }

            });
          // this.manualentryservice.GetDesingationDetails(lineid, apipath['server']).subscribe(
          //   (data: any[]) => {
          //     for (let i = 0; i < data.length; i++) {
          //       const c = data[i];
          //       const Designation_data =
          //       {
          //         designationid: c._id,
          //         designationdisplayname: c.display_name
          //       }
          //       this.Designations.push(Designation_data);
          //     }
          //   });

          this.manualentryservice.GetFormatData(apipath['server'],apipath['line_id']).subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const c = data[i];
                const Format_data =
                {
                  formatid: c._id,
                  formatname: c.format_name
                }
                this.Formats.push(Format_data);
              }
            });
        }
      }
    );
  }
  GetSKUdata(lineid) {
    this.SKUdata = [];
    this.manualentryservice.GetServerAPIPath().subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.manualentryservice.GetSkuDetails(lineid, apipath['server']).subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const c = data[i];

                const EqID = []
                const Eqname = [];

                const DesID = [];
                const Desname = [];

                const FormatID = [];
                const FormatName = [];
                for (let j = 0; j < data[i].equipments.length; j++) {
                  EqID.push(data[i].equipments[j]._id);
                  Eqname.push(data[i].equipments[j].display_name);
                }
                // for (let j = 0; j < data[i].manpower.length; j++) {
                //   DesID.push(data[i].manpower[j]._id);
                //   Desname.push(data[i].manpower[j].display_name);
                // }
                for (let j = 0; j < data[i].format_id.length; j++) {
                  FormatID.push(data[i].format_id[j]._id);
                  FormatName.push(data[i].format_id[j].format_name);
                }
                const sku_data =
                {
                  skuid: c._id,
                  skunumber: c.sku_number,
                  skuname: c.sku_name,
                  lineid: c.line_id,
                  linename: c.line_id,
                  equipmentsid: EqID,
                  equipments: Eqname,
                  ratedspeed: c.rated_speed,
                  bpc: c.bpc,
                  minweightrange: c.min_weight_range,
                  maxweightrange: c.max_weight_range,

                  reliver: c.reliver,
                  designationsid: DesID,
                  designations: Desname,
                  formatid: FormatID,
                  formatname: FormatName,
                  group: c.group,
                  bottleneck: c.bottle_neck,
                  //bpm: c.bpm,
                  cpp: c.cpp,
                  speedpershift: c.speed_per_shift,
                  standardspeed: c.standard_speed,
                  changover_start_calculation_minute: c.changover_start_calculation_minute,
                  production_start_calculation_minute: c.production_start_calculation_minute
                }
                this.SKUdata.push(sku_data);
              }
              this.vdisplayedColumns = [];
              if (Object.keys(data).length > 0) {
                for (let i = 0; i < Object.keys(this.SKUdata[0]).length; i++) {
                  this.vdisplayedColumns.push(Object.keys(this.SKUdata[0])[i]);
                }
                this.vdisplayedColumns.push('star');
                this.gotData = true;

                this.dataSource = new MatTableDataSource(this.SKUdata);
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

  ngOnChanges(changes: SimpleChanges): void {
    this.LineId = changes.lineid.currentValue;
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      this.GetSKUdata(changes.lineid.currentValue);
      this.GetequipmentData(changes.lineid.currentValue);
    }
  }

  ngOnInit() {
    let group = {}
  }

  DailogAddUpdateSKU(element) {
    if (element === null) {
      const dialogRef = this.dialog.open(SkuformdailogComponent, {
        width: '800px',
        height: '640px',
        data: {
          dataKey: {
            Equipments: this.Equipments,//this.GetequipmentData(this.lineid),//
            manpower: this.Designations,//this.GetManpower(this.lineid),
            Formats: this.Formats,
            LineId: this.LineId,
            rowdata: '',
            show: 'false',
            title: 'Add ',
            button: 'Done'
          }
        }
      });

      dialogRef.afterClosed().subscribe(result => {

        this.postFormData(result);
        //this.openSnackBar("Success", "Records Added Successfully");
      });
    }
    else {
      const dialogRef = this.dialog.open(SkuformdailogComponent, {
        width: '800px',
        height: '640px',
        data: {
          dataKey: {
            Equipments: this.Equipments,//this.GetequipmentData(this.lineid),//
            manpower: this.Designations,//this.GetManpower(this.lineid),
            Formats: this.Formats,
            LineId: this.LineId,
            rowdata: element,
            show: 'false',
            title: 'Edit ',
            button: 'Done'
          }
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        //this.GetSKUdata(this.LineId);
        this.postFormData(result);
        //this.openSnackBar("Success", "Records Updated Successfully");
      });
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  postFormData(result) {
    if (result !== undefined) {
      this.httpClient.get('configs/apix/api_server.json').subscribe(
        apipath => {
          if (apipath['server'] !== undefined) {
            const T = {
              _id: result.sku_id === "" || result.sku_id === undefined ? null : result.sku_id,
              sku_number: result.sku_number,
              sku_name: result.sku_name,
              line_id: this.LineId,
              equipments: result.equipments,
              rated_speed: result.rated_speed,
              format_id: result.formats,

              bpc: result.bpc,
              min_weight_range: result.min_weight_range === undefined ? null : result.min_weight_range,
              max_weight_range: result.max_weight_range === undefined ? null : result.max_weight_range,
              reliver: result.reliver === undefined ? null : result.reliver,
              manpower: result.designations === undefined ? null : result.designations,

              group: result.group === undefined ? null : result.group,
              bottle_neck: result.bottleneck === undefined ? null : result.bottleneck,
              //bpm: this.bpm,
              cpp: result.cpp,
              speed_per_shift: result.speedpershift === undefined ? null : result.speedpershift,

              standard_speed: result.standardspeed === undefined ? null : result.standardspeed,
              changover_start_calculation_minute: result.changover_start_calculation_minute === undefined ? null : result.changover_start_calculation_minute,
              production_start_calculation_minute: result.production_start_calculation === undefined ? null : result.production_start_calculation
            }
            this.httpClient.post(apipath['server'] + '/api/manual/sku', T).subscribe(
              (data: any[]) => {
                this.openSnackBar("Success", "Records has been added/updated successfully");
                this.GetSKUdata(this.LineId);
                //this.GetSKUdata(this.LineId);//This.lineid is @input parameter.
                //result.skuform.reset();
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
  }

}
