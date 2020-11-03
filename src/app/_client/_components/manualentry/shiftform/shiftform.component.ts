import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
interface Shift {
  shiftid: string;
  lineid: string;
  shiftname: string;
  shiftstarttime: string;
  shiftendtime: string;
}
@Component({
  selector: 'app-shiftform',
  templateUrl: './shiftform.component.html',
  styleUrls: ['./shiftform.component.scss'],
})
export class ShiftformComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  //public Companies: Company[] = [];
  @Input() lineid: string;
  public Shifts: Shift[] = [];
  selected: boolean = false;
  showshift: boolean = true;
  Temp;
  gotData: boolean = false;
  shiftform: FormGroup;

  _id: FormControl;
  shift_name: FormControl;
  shiftStartTime: FormControl;
  shiftEndTime: FormControl;

  displayedColumns: string[];
  vdisplayedColumns: string[];
  typepdt: boolean = true;

  dataSource: MatTableDataSource<Shift>;

  displayedColumnsAs = {
    shiftid: { DN: 'Shift', visible: true },
    shiftname: { DN: 'Shift', visible: false },
    lineid: { DN: 'Line', visible: true },
    shiftstarttime: { DN: 'PDT Start', visible: false },
    shiftendtime: { DN: 'PDT End', visible: false },
  };
  HideColumnsAs: string[] = ['_id', '__v'];

  createFormControlsShiftData() {
    this._id = new FormControl('');
    this.shift_name = new FormControl('', Validators.required);
    this.shiftStartTime = new FormControl('', Validators.required);
    this.shiftEndTime = new FormControl('', Validators.required);
  }

  createShiftForm() {
    this.shiftform = new FormGroup({
      shift_name: this.shift_name,
      shiftStartTime: this.shiftStartTime,
      shiftEndTime: this.shiftEndTime,
    });
  }

  ngOnInit() {
    this.createFormControlsShiftData();
    this.createShiftForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.lineid.currentValue);
    this.lineid = changes.lineid.currentValue;
    if (
      changes.lineid.currentValue != null &&
      changes.lineid.currentValue != ''
    ) {
      this.GetShiftData(changes.lineid.currentValue);
    }
  }

  GetShiftData(lineid) {
    console.log(lineid);
    this.Shifts = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe((apipath) => {
      if (apipath['server'] !== undefined) {
        //console.log()
        this.httpClient
          .get(apipath['server'] + '/api/manual/shift?line_id=' + lineid)
          .subscribe((data: any[]) => {
            console.log(
              apipath['server'] + '/api/manual/shift?line_id=' + lineid
            );
            //console.log(apipath['server'] + '/api/manual/shift?line_id=' + lineid);
            for (let i = 0; i < data.length; i++) {
              const c = data[i];
              const shift_data = {
                shiftid: c._id,
                lineid: lineid,
                shiftname: c.shift,
                shiftstarttime: c.shiftStartTime,
                shiftendtime: c.shiftEndTime,
              };
              this.Shifts.push(shift_data);
            }
            //console.log(this.Shifts);

            console.log(this.Shifts);
            this.vdisplayedColumns = [];
            if (Object.keys(data).length > 0) {
              for (let i = 0; i < Object.keys(this.Shifts[0]).length; i++) {
                this.vdisplayedColumns.push(Object.keys(this.Shifts[0])[i]);
              }
              this.vdisplayedColumns.push('star');
              this.gotData = true;
              this.dataSource = new MatTableDataSource(this.Shifts);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.displayedColumns = this.vdisplayedColumns;
            } else {
              console.log('else part called');
              this.gotData = true;
              this.dataSource = null;
              this.displayedColumns = this.vdisplayedColumns;
            }
          });
      }
    });
  }

  updateRow(element) {
    console.log(element);
    this.shiftform.patchValue({
      shift_name: element.shift_name,
      shiftStartTime: element.shiftStartTime,
      shiftEndTime: element.shiftEndTime,
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  postShiftFormData() {}
}
