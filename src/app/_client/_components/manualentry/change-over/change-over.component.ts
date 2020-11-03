import { ManualEntryService } from './../../manual-entry.service';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { ReplaySubject, Subject } from 'rxjs';

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
  type: string;
}

interface ChangeoverType {
  ChangeoverTypeID: string;
  ChangeoverType: string;
  ChangeoverTypeName: string;
  ChangeovertypeDuration: string;
}

interface FGex {
  FGexID: string;
  FGexValue: string;
}
interface Product {
  ProductID: string;
  ProductName: string;
}
interface BindData {
  type: string;
  batchsize: string;
  ProductName: string;
  FGexID: number;
  batchname: string;
}
@Component({
  selector: 'app-change-over',
  templateUrl: './change-over.component.html',
  styleUrls: ['./change-over.component.scss'],
})
export class ChangeOverComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  title: string = 'Changeover Process';
  constructor(
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private manualentryservice: ManualEntryService
  ) { }

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

  public filteredProducts = this.Products.slice();
  //public filterProduct: Product[] = [];

  //public filterProduct: ReplaySubject<Product[]> = new ReplaySubject<Product[]>(1);

  //public FGex: FGex[] = [];
  public ChangeoverType: ChangeoverType[] = [];
  public BindData: BindData[] = [];

  displayedColumns: string[];
  gotData: boolean = false;

  DisableScreen: boolean = false;
  DisableStart: boolean = false;
  DisableStop: boolean = true;
  DisableProductionStart: boolean = true;

  vdisplayedColumns: string[];

  changeoverForm: FormGroup;
  _id: FormControl;
  changeover_type_id: FormControl;
  batch_name: FormControl;
  batch_size: FormControl;
  product_id: FormControl;
  //fgex: FormControl;
  //Used for Labels
  fgexLabel;
  batchnameLabel;
  batchsizeLabel;
  productnameLabel;
  updated = false;

  fgexvalue;

  //For machines names
  std_duration: number = 0;
  total_time_elapsed: number = 0;

  time_elapsed: number = 0;
  overtime: number = 0;
  interval;

  changeover_started_date;
  changeover_ended_date;
  ShowProductionStartScreen = false;

  Machines: string[];
  allmachines;

  //For machine states
  allmachinestates;
  States;

  TimelineOptions = {
    height: 200,
    width: 500,
    colors: ['green', 'blue', 'red'],
    legend: 'none',
    tooltip: { trigger: 'none' },
    //timeline: { colorByRowLabel: true }
  };

  Timelines = {
    chartType: 'Timeline',
    title: 'DES',
    dataTable: [
      ['Total Time', 'Dummy', 'Start', 'End'],
      ['Standard', 'Standard', 0, 90],
    ],
    options: this.TimelineOptions,
  };

  createFormControlsequipment() {
    this._id = new FormControl('');
    this.changeover_type_id = new FormControl('', Validators.required);
    this.batch_name = new FormControl('', Validators.required);
    this.batch_size = new FormControl('', Validators.required);
    this.product_id = new FormControl('', Validators.required);
    //this.fgex = new FormControl('', Validators.required);
  }

  createchangeoverForm() {
    this.changeoverForm = new FormGroup({
      _id: this._id,
      changeover_type_id: this.changeover_type_id,
      batch_name: this.batch_name,
      batch_size: this.batch_size,
      product_id: this.product_id,
      //fgex: this.fgex,
    });
  }

  GetChangeoverDetails(lineid) {
    this.Changeover = [];
    //this.FGex = [];
    this.Products = [];
    this.BindData = [];
    this.manualentryservice.GetServerAPIPath().subscribe((apipath) => {
      if (apipath['server'] !== undefined) {
        this.manualentryservice
          .GetChangeOverData(apipath['server'])
          .subscribe((data: any[]) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
              const c = data[i];
              console.log(c);
              const ChangeoverType_data = {
                ChangeoverType: c.changeover_type,
                ChangeoverTypeName: c.changeover_name,
                //ChangeoverTypeName: c.changeover_type + ' ' + c.changeover_name,
                ChangeoverTypeID: c._id,
                ChangeovertypeDuration: c.standard_duration,
              };
              this.ChangeoverType.push(ChangeoverType_data);
            }
          });

        // this.manualentryservice
        //   .GetFgexData(apipath['server'])
        //   .subscribe((data: any[]) => {
        //     //console.log(data);
        //     for (let i = 0; i < data.length; i++) {
        //       const c = data[i];
        //       //console.log(c);
        //       const Fgex_data = {
        //         FGexID: c.fgex,
        //         FGexValue: c.fgex,
        //       };
        //       this.FGex.push(Fgex_data);
        //     }
        //   });

        this.manualentryservice
          .GetFgexData(apipath['server'])
          .subscribe((data: any[]) => {
            for (let i = 0; i < data.length; i++) {
              const c = data[i];
              //console.log(c);
              const Product_data = {
                ProductID: c._id,
                ProductName: c.fgex + ' | ' + c.product_name,
              };
              this.Products.push(Product_data);
            }
            //this.filterProduct.next(this.Products.slice());
            this.filteredProducts = this.Products.slice();
          });

        this.manualentryservice
          .GetChangeoverCurrent(apipath['server'])
          .subscribe((data: any) => {
            try {
              //IF current changeover is running then below (useful in accidental refresh)
              if (
                data.changeover_finished == null ||
                data.changeover_finished === ''
              ) {
                console.log('------------changeover_finished-----------------');
                this.DisableScreen = true;
                this.DisableStart = true;
                this.DisableStop = false;
                this.DisableProductionStart = true;
              } else if (
                data.changeover_end_date == null ||
                data.changeover_end_date === ''
              ) {
                this.DisableScreen = true;
                this.DisableStart = true;
                this.DisableStop = true;
                this.ShowProductionStartScreen = true;
                this.DisableProductionStart = false;
              }

              this._id.setValue(data._id);
              try {
                this.changeover_type_id.setValue(
                  data.changeover_type_id._id +
                  '-' +
                  data.changeover_type_id.standard_duration +
                  '-' +
                  data.changeover_type_id.changeover_type
                );
              } catch {
                this.changeover_type_id.setValue('');
              }
              this.batch_name.setValue(data.batch_name);
              this.batch_size.setValue(data.batch_size);

              this.fgexvalue = data.fgex;
              this.product_id.setValue(
                data && data.product_id && data.product_id._id
              );

              this.std_duration =
                data &&
                data.changeover_type_id &&
                data.changeover_type_id.standard_duration;
              //Showing Production start screen.
              this.ShowProductionStartScreen = true;
              //this.DisableScreen = true;

              this.SetChartUpdateTimer(data.changeover_start_date);
              this.interval = setInterval(() => {
                this.SetChartUpdateTimer(data.changeover_start_date);
              }, 5000);
              console.log(this.std_duration, data.changeover_type_id._id);

              //else if(data.)
            } catch {
              console.log(
                'Error with API : ' +
                apipath['server'] +
                '/api/changeover/current'
              );
            }
          });
        this.manualentryservice
          .BindChangeOverData(apipath['server'], apipath['line_id'])
          .subscribe((data: any) => {
            console.log(data);
            try {
              for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
                if (data[i].machine === 'cam_blister') {
                  this.batchnameLabel = data[i].batch;
                  this.productnameLabel = data[i].product;
                  this.batchsizeLabel = data[i].batch_size;
                  this.fgexLabel = data[i].fgex;

                  this.batch_name.setValue(data[i].batch);
                  this.product_id.setValue(
                    data[i] && data[i].product_id && data[i].product_id._id
                  );
                  this.batch_size.setValue(data[i].batch_size);
                  this.fgexvalue = data[i].fgex;
                  //this.fgex.setValue(data[i].fgex);
                }
              }
            } catch {
              console.log('something went wrong:');
            }
          });
      }
    });
  }

  SetChartUpdateTimer(changeoverStartDate) {
    
    // console.log("STD Duration "+this.std_duration);
    // console.log(changeoverStartDate);
    // console.log(this.total_time_elapsed,this.total_time_elapsed);
    // console.log(moment(new Date(), 'HH:mm:ss').diff(moment(new Date(changeoverStartDate), 'HH:mm:ss'), 'minutes'));
    this.total_time_elapsed = moment((new Date()), 'HH:mm:ss').diff(
      moment( (new Date(changeoverStartDate)), 'HH:mm:ss'),
      'minutes'
    );
    // console.log(this.total_time_elapsed,this.std_duration);
    // console.log(this.std_duration,this.total_time_elapsed);

    if (this.total_time_elapsed > this.std_duration) {
      this.overtime = this.total_time_elapsed - this.std_duration;
      this.time_elapsed = this.std_duration;

      console.log(
        'STD:' + this.std_duration,
        'time_elapsed' + this.time_elapsed,
        'overtime' + this.overtime,
        'total_time_elapsed:' + this.total_time_elapsed
      );
      this.Timelines.dataTable = [
        ['Total Time', '', 'Start', 'End'],
        [
          'Standard',
          'Standard-' + this.std_duration + ' min.',
          0,
          this.std_duration,
        ],
        [
          'Elapsed',
          'Elapsed-' + this.time_elapsed + ' min.',
          0,
          this.time_elapsed,
        ],
        [
          'Elapsed',
          'Overtime-' + this.overtime,
          this.std_duration,
          this.total_time_elapsed,
        ],
      ];
    } else {
      //console.log(parseInt(this.std_duration),this.time_elapsed);
      //var T:number= parseInt(this.std_duration)
      this.time_elapsed = this.total_time_elapsed;
      this.Timelines.dataTable = [];
      this.Timelines.dataTable = [
        ['Total Time', 'Dummy', 'Start', 'End'],
        [
          'Standard',
          'Standard-' + this.std_duration + ' min.',
          0,
          this.std_duration,
        ],
        [
          'Elapsed',
          'Elapsed-' + this.time_elapsed + ' min.',
          0,
          this.time_elapsed,
        ],
      ];
    }
    this.changeover_started_date = moment( this.manualentryservice.ConvertToLocalTimezone( new Date(changeoverStartDate))).format(
      'DD-MMM-YYYY HH:mm'
    );
    this.Timelines = Object.create(this.Timelines);
    this.updated = !this.updated;
  }

  ngOnInit() {
    this.createFormControlsequipment();
    this.createchangeoverForm();
    this.GetChangeoverDetails('');
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.lineid = changes.lineid.currentValue;
    if (
      changes.lineid.currentValue != null &&
      changes.lineid.currentValue != ''
    ) {
      this.GetChangeoverDetails(changes.lineid.currentValue);
    }
  }

  ProductChange($event) {
    console.log();
    try {
      let f = this.Products.find(i => i.ProductID === $event.value).ProductName;
      this.fgexvalue = f.split("|")[0].replace(/\s/g, "");
    }
    catch (error) {
      console.log(error);
    }
  }

  ChangeOverStart() {
    //Post + Graph + GET
    console.log(this.changeover_type_id.value);
    console.log(this.batch_name.value);
    console.log(this.batch_size.value);
    console.log(this.product_id.value);
    console.log(this.fgexvalue);
    console.log(this.std_duration);

    // this.DisableScreen = true;
    // this.DisableStart = true;
    // this.DisableStop = false;
    // this.DisableProductionStart = true;

    this.manualentryservice.GetServerAPIPath().subscribe((apipath) => {
      if (apipath['server'] !== undefined) {
        var T = {};
        T = {
          changeover_type_id: this.changeover_type_id.value.split('-')[0],
          batch_name: this.batch_name.value,
          batch_size: this.batch_size.value,
          product_id: this.product_id.value,
          fgex: this.fgexvalue,
          changeover_start_date: moment(this.manualentryservice.ConvertToLocalTimezone(new Date())).format(
            'YYYY-MM-DDTHH:mm:ss'
          ),
          duration: this.std_duration,
          line_id: apipath['line_id'],
        };
        console.log(T);
        // console.log(this.std_duration);
        this.manualentryservice
          .PostChangeoverData(apipath['server'], T)
          .subscribe(
            (data: any) => {
              console.log(data);
              //Disabling screen
              // this.DisableScreen = true;
              this.DisableScreen = true;
              this.DisableStart = true;
              this.DisableStop = false;
              this.DisableProductionStart = true;

              //Bindng ID as it would be useful
              this._id.setValue(data._id);
              console.log(this.std_duration);
              this.ShowProductionStartScreen = true;
              this.SetChartUpdateTimer(data.changeover_start_date);
              this.interval = setInterval(() => {
                this.SetChartUpdateTimer(data.changeover_start_date);
              }, 5000);

              //this.GetChangeOverData(this.lineid);
              this.openSnackBar(
                'Success',
                'Changeover Process has started successfully'
              );
              //this.openSnackBar("Request Successfull");
            },
            (error: HttpErrorResponse) => {
              console.log(error);
              if (error.status == 409) {
                this.openSnackBar('Validation', error.error);
              } else {
                this.openSnackBar('Error', "Batch is Duplicate or Machine is powered OFF");
                // this.openSnackBar('Error', error.error);
              }
            }
          );
      }
    });
  }

  ChangeoverStop() {
    this.DisableScreen = true;
    this.DisableStart = true;
    this.DisableStop = true;
    this.DisableProductionStart = false;

    this.manualentryservice.GetServerAPIPath().subscribe((apipath) => {
      if (apipath['server'] !== undefined) {
        console.log(T);
        console.log(this.std_duration);
        var T = {};
        T = {
          changeover_type_id: this.changeover_type_id.value.split('-')[0],
          batch_name: this.batch_name.value,
          batch_size: this.batch_size.value,
          product_id: this.product_id.value,
          fgex: this.fgexvalue,
          changeover_finished: moment( this.manualentryservice.ConvertToLocalTimezone(new Date())).format('YYYY-MM-DDTHH:mm:ss'),
          duration: this.std_duration,
          line_id: apipath['line_id'],
        };
        this.manualentryservice
          .PostChangeoverData(apipath['server'], T)
          .subscribe(
            (data: any) => {
              console.log(data);
              //Disabling screen
              this.DisableScreen = true;

              //Bindng ID as it would be useful
              this._id.setValue(data._id);
              try {
                this.changeover_ended_date = data.changeover_finished;
              } catch {
                this.changeover_ended_date = '';
              }
              console.log(this.std_duration);
              this.ShowProductionStartScreen = true;
              this.SetChartUpdateTimer(data.changeover_start_date);
              this.interval = setInterval(() => {
                this.SetChartUpdateTimer(data.changeover_start_date);
              }, 5000);

              //this.GetChangeOverData(this.lineid);
              this.openSnackBar(
                'Success',
                'Changeover Process has been stopped successfully'
              );
              //this.openSnackBar("Request Successfull");
            },
            (error: HttpErrorResponse) => {
              console.log(error);
              if (error.status == 409) {
                this.openSnackBar('Validation', error.error);
              } else {
                this.openSnackBar('Error', error.error);
              }
            }
          );
        this.ClearInterval();
      }
    });
  }

  ProductionStart() {
    console.log(this.std_duration);
    this.DisableScreen = true;
    this.DisableStart = true;
    this.DisableStop = true;
    this.DisableProductionStart = true;

    this.manualentryservice.GetServerAPIPath().subscribe((apipath) => {
      if (apipath['server'] !== undefined) {
        var T = {};
        T = {
          _id: this._id.value,
          changeover_type_id: this.changeover_type_id.value,
          batch_name: this.batch_name.value,
          batch_size: this.batch_size.value,
          product_id: this.product_id.value,
          fgex: this.fgexvalue,
          //changeover_start_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
          changeover_end_date: moment(this.manualentryservice.ConvertToLocalTimezone (new Date())).format('YYYY-MM-DDTHH:mm:ss'),
          duration: this.std_duration,
          line_id: apipath['line_id'],
        };
        console.log(T);
        this.manualentryservice.GetServerAPIPath().subscribe((apipath) => {
          if (apipath['server'] !== undefined) {
            this.manualentryservice
              .PostChangeoverData(apipath['server'], T)
              .subscribe(
                (data: any[]) => {
                  console.log(data);
                  //this.GetChangeOverData(this.lineid);
                  this.openSnackBar(
                    'Success',
                    'Production has been started now'
                  );
                  window.location.reload();
                  //this.openSnackBar("Request Successfull");
                },
                (error: HttpErrorResponse) => {
                  console.log(error);
                  if (error.status == 409) {
                    this.openSnackBar('Validation', error.error);
                  } else {
                    this.openSnackBar('Error', error.error);
                  }
                }
              );
            this.ClearInterval();
          }
        });
      }
    });
  }

  CriteriaSelection(event) {
    console.log(event);
    this.std_duration = parseInt(event.split('-')[1]);
    console.log(this.std_duration);
    //Disable on Type A

    if (event.includes('Type A')) {
      //this.changeoverForm.controls['fgex'].disable();
      this.changeoverForm.controls['product_id'].disable();
    } else if (event.includes('Type B')) {
      //this.changeoverForm.controls['fgex'].disable();
      this.changeoverForm.controls['product_id'].enable();
    } else if (event.includes('Type C')) {
      //this.changeoverForm.controls['fgex'].enable();
      this.changeoverForm.controls['product_id'].enable();
    }
  }

  ClearInterval() {
    clearInterval(this.interval);
    console.log('-----------Interval cleared out----------------');
  }
}
