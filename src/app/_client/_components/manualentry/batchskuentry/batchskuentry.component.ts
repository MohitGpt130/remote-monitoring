import { ManualEntryService } from './../../manual-entry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

interface OperatorEntry {
  operatorEntryname: string;
  operatorEntrycode: string;
  operatorEntrydisplayName: string;
  operatorEntryorigin: string;
  operatorEntryid: string;
}
interface CurrentBatchSKU {
  //start_time: string;
  // batch_id: string;
  target_quantity: string;
  // sku_number: string;
  date: string;
  sku: string;
  shiftA: string;
  shiftB: string;
  shiftC: string;
}
@Component({
  selector: 'app-batchskuentry',
  templateUrl: './batchskuentry.component.html',
  styleUrls: ['./batchskuentry.component.scss']
})

export class BatchskuentryComponent implements OnInit {

  batchentryform: FormGroup;

  _id: FormControl;
  //sku: FormControl;
  operator_name: FormControl;
  //batch_id: FormControl;
  shiftA: FormControl;
  shiftB: FormControl;
  shiftC: FormControl;
  //target_quantity: FormControl;
  date: FormControl;

  shifts;
  line_id;
  // start_time: FormControl;
  //target_quantity:FormControl;

  public todayDate: any = new Date();
  // public SKUdata: SKU[] = [];
  public Operatordata: OperatorEntry[] = [];
  public Currentbatchskudata: CurrentBatchSKU[] = [];
  // public CurrentbatchShiftdata: CurrentBatchShift[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<BatchskuentryComponent>,
    private httpClient: HttpClient, private _snackBar: MatSnackBar, private manualentryservice: ManualEntryService,
    protected datePipe: DatePipe) {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createFormControlsBatchForm() {
    this._id = new FormControl('');
    this.date = new FormControl('');
    //this.sku = new FormControl('');
    // this.sku = new FormControl('', Validators.required);
    this.shiftA = new FormControl('');
    this.shiftB = new FormControl('');
    this.shiftC = new FormControl('');
    //this.batch_id = new FormControl('', [Validators.required]);
    // this.start_date = new FormControl('');
    //this.target_quantity = new FormControl('', Validators.required);
    // this.operator_name = new FormControl('', Validators.required);
  }

  createBatchForm() {
    this.batchentryform = new FormGroup({
      _id: this._id,
      shiftA: this.shiftA,
      shiftB: this.shiftB,
      shiftC: this.shiftC,
      //batch_id: this.batch_id,
      date: this.date,
      //target_quantity: this.target_quantity,
      //sku: this.sku
    });
  }

  GetOperatordata() {
    this.Operatordata = [];
    this.manualentryservice.GetServerAPIPath().subscribe(
      (apipath: any) => {
        this.line_id = apipath.lineid;
        if (apipath['server'] !== undefined) {
          this.manualentryservice.GetOperatorDetails(apipath['lineid'], apipath['server']).subscribe(
            (data: any[]) => {
              //console.log(data);
              for (let i = 0; i < data.length; i++) {
                //console.log(data[i]);
                const c = data[i];

                const sku_data =
                {
                  operatorEntryname: c.operator_name,
                  operatorEntrycode: c.code,
                  operatorEntrydisplayName: c.operator_name,
                  operatorEntryorigin: c.origin,
                  operatorEntryid: c._id
                }
                this.Operatordata.push(sku_data);
              }
              //console.log(this.Operatordata);
            }
          )
        }
      }
    );
  }

  GetCurrentBatchSKUDetails() {
    this.Currentbatchskudata = [];
    this.manualentryservice.GetServerAPIPath().subscribe(apipath => {
      if (apipath['server'] !== undefined) {
        console.log(apipath['line_id'], apipath['server'])
        this.manualentryservice.GetCurrentBatchSKU(apipath['line_id'], apipath['server']).subscribe(
          (data: any) => {
            console.log(data);
            const c = data;
            console.log(c.isactive);
            //const shiftA, shiftB,shiftC;
            const shiftA = c.operator ? c.operator && c.operator.shift_wise[0] && c.operator.shift_wise[0].operator_name._id : '';
            const shiftB = c.operator ? c.operator && c.operator.shift_wise[1] && c.operator.shift_wise[1].operator_name._id : '';
            const shiftC = c.operator ? c.operator && c.operator.shift_wise[2] && c.operator.shift_wise[2].operator_name._id : '';

            //if (c.isactive === false) {//This should Be TRUE (Active one only)
            this.batchentryform.patchValue({
              // batch_id: c.batch_id,
              target_quantity: c.target_quantity,
              // sku_number: c.sku_number,
              date: this.datePipe.transform(c.date, 'dd-MM-yyyy'),
              sku: c.sku,
              shiftA: shiftA,
              shiftB: shiftB,
              shiftC: shiftC
            });
            //            console.log(this.batch_id.value);

            const current_data =
            {
              batch_id: c.batch_id,
              target_quantity: c.target_quantity,
              sku_number: c.sku_number,
              date: c.date,
              sku: c.sku,
              shiftA: shiftA,
              shiftB: shiftB,
              shiftC: shiftC,
            }
            this.Currentbatchskudata.push(current_data);
          }
        )
      }
    }
    );
  }

  ngOnInit() {
    this.createFormControlsBatchForm();
    this.createBatchForm();
    this.GetOperatordata();
    this.GetCurrentBatchSKUDetails();
  }

  close() {
    this.dialogRef.close();
  }

  SubmitChanges() {
    //console.log("I have reached function");
    this.manualentryservice.GetServerAPIPath().subscribe
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          var T = {};
          // if (this._id.value !== null) {
          T = {
            //_id: this._id.value,
            // sku: this.sku.value,
            //target_quantity: this.target_quantity.value,
            //batch_id: this.batch_id.value,
            // operator_name : this.operator_name
            operator: {
              date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
              line_id: this.line_id,
              shift_wise: [
                {
                  shift_name: 'Shift A',
                  operator_name: this.shiftA.value
                },
                {
                  shift_name: 'Shift B',
                  operator_name: this.shiftB.value
                },
                {
                  shift_name: 'Shift C',
                  operator_name: this.shiftC.value
                }
              ]
            }
          }

          console.log("Data which is being posted : " + JSON.stringify(T));
          console.log(apipath['server'] + '/api/manual/currentsku');
          this.httpClient.post(apipath['server'] + '/api/manual/currentsku', T).subscribe(
            (data: any[]) => {
              console.log(data);
              this.dialogRef.close({ event: 'close', data: data });
              this.batchentryform.reset();
              this.openSnackBar("Success", "Request Successfull");
            },
            (error: HttpErrorResponse) => {
              //console.log(error);
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
