import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-skuformdailog',
  templateUrl: './skuformdailog.component.html',
  styleUrls: ['./skuformdailog.component.scss']
})
export class SkuformdailogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private httpClient: HttpClient, private _snackBar: MatSnackBar) { }
  LineId;
  skuform: FormGroup;
  myFormGroupSubs: Subscription;

  sku_id: FormControl;
  sku_number: FormControl;
  sku_name: FormControl;
  equipments: FormControl;
  rated_speed: FormControl;

  bpc: FormControl;
  min_weight_range: FormControl;
  max_weight_range: FormControl;
  reliver: FormControl;
  designations: FormControl;
  formats:FormControl;

  group: FormControl;
  bottleneck: FormControl;
  cpp: FormControl;
  speedpershift: FormControl;

  standardspeed: FormControl;
  changover_start_calculation_minute: FormControl;
  production_start_calculation
  //bpm: FormControl;_minute: FormControl;

  Equipments;
  Designations;
  Formats;

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormControlsSKU() {
    this.sku_id = new FormControl('');
    this.sku_number = new FormControl('');
    this.sku_name = new FormControl('');
    this.equipments = new FormControl('');
    this.rated_speed = new FormControl('');

    this.bpc = new FormControl('');
    this.min_weight_range = new FormControl('');
    this.max_weight_range = new FormControl('');
    this.reliver = new FormControl('');
    this.designations = new FormControl('');
    this.formats = new FormControl('');

    this.group = new FormControl('');
    this.bottleneck = new FormControl('');
    //this.bpm = new FormControl('');
    this.cpp = new FormControl('');
    this.speedpershift = new FormControl('');

    this.standardspeed = new FormControl('');
    this.changover_start_calculation_minute = new FormControl('');
    this.production_start_calculation = new FormControl('');
  }

  createSKUForm() {
    this.skuform = new FormGroup({
      sku_id: this.sku_id,
      sku_number: this.sku_number,
      sku_name: this.sku_name,
      equipments: this.equipments,
      rated_speed: this.rated_speed,

      bpc: this.bpc,
      min_weight_range: this.min_weight_range,
      max_weight_range: this.max_weight_range,
      reliver: this.reliver,
      designations: this.designations,
      formats:this.formats,

      group: this.group,
      bottleneck: this.bottleneck,
      //bpm: this.bpm,
      cpp: this.cpp,
      speedpershift: this.speedpershift,

      standardspeed: this.standardspeed,
      changover_start_calculation_minute: this.changover_start_calculation_minute,
      production_start_calculation_minute: this.production_start_calculation
    });
  }

  ngOnInit() {
    console.log(this.data);
    this.createFormControlsSKU();
    this.createSKUForm();
    this.Equipments = this.data.dataKey.Equipments;
    this.Designations = this.data.dataKey.manpower;
    this.LineId = this.data.dataKey.LineId;
    this.Formats =this.data.dataKey.Formats;

    if(this.data.dataKey.rowdata !==null )
    {
      console.log(this.data.dataKey.rowdata);
      const T=this.data.dataKey.rowdata;
      this.skuform.patchValue({
        sku_id: T.skuid,
        sku_number: T.skunumber,
        sku_name: T.skuname,
        equipments: T.equipmentsid,
        rated_speed: T.ratedspeed,

        bpc: T.bpc,
        min_weight_range: T.minweightrange,
        max_weight_range: T.maxweightrange,
        reliver: T.reliver,
        designations: T.designationsid,
        formats:T.formatid,

        group: T.group,
        bottleneck: T.bottleneck,
        //bpm: T.,
        cpp: T.cpp,
        speedpershift: T.speedpershift,

        standardspeed: T.standardspeed,
        changover_start_calculation_minute: T.changover_start_calculation_minute,
        production_start_calculation_minute: T.production_start_calculation_minute,
      });
    }
  }
}
