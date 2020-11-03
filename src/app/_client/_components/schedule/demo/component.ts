import { DataService } from './../../data.service';
import { ManualEntryService } from './../../manual-entry.service';

import { Component, ChangeDetectionStrategy, OnInit, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
} from 'date-fns';
import { Observable } from 'rxjs';
import { colors } from '../demo-utils/colors';
import { ScheduleDialogComponent } from '../schedule-dialog/schedule-dialog.component';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

interface Schedule {
  _id: string;
  title: string;
  status: string;
  start_time: Date;
  end_time: Date;
}

function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, '0');
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
  const direction = timezoneOffset > 0 ? '-' : '+';

  return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'template.html',
  encapsulation: ViewEncapsulation.None
})
export class DemoComponent implements OnInit {
  @Input() lineid: string;
  APIPath;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events$: Observable<Array<CalendarEvent<{ schedule: Schedule }>>>;
  activeDayIsOpen: boolean = false;

  scheduleAPI;

  constructor(private http: HttpClient,
    private appDataService: DataService,
    protected dataentryservice:ManualEntryService,
    protected datepipe:DatePipe,
    public dialog: MatDialog, private _snackBar: MatSnackBar) {
    //console.log(this.lineid);
    if (this.lineid != null) {
      this.fetchEvents();
      //console.log(this.events$);
    }
    dialog.afterAllClosed
      .subscribe(() => {
        //console.log('dialog afterAllClosed called');
        this.fetchEvents();
      }
      );
  }
  ngOnInit(): void {
    //console.log(new Date('2020-04-22T09:00:00'));
    if(this.appDataService.api_server) {
      this.scheduleAPI = this.appDataService.api_server.apis.manual.serverAPI;
      //console.log(this.scheduleAPI);
    } else {
      this.http.get('configs/apix/api_server.json').subscribe(
        (data: any) => {
          this.scheduleAPI = data.apis.manual.serverAPI;
          //console.log(this.scheduleAPI);
          if (data['server'] !== undefined) {
          } else {
            //console.log('missing server api json file');
          }
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    const params = new HttpParams()
      .set(
        'startTime',
        format(getStart(this.viewDate), 'yyyy-MM-dd')
      )
      .set(
        'endTime',
        format(getEnd(this.viewDate), 'yyyy-MM-dd')
      )
      .set('line_id', this.lineid)
      .set('dummy', 'adsf' + Math.floor(Math.random() * 6) + 1);
    this.BindEvents(params);
    //this.dataAPIserver(params)
    //this.refresh.next();
  }

  async dataAPIserver(params) {
    let data = await this.http.get('configs/apix/api_server.json').toPromise();
    //console.log(data['server']);
  }

  BindEvents(params) {
    //console.log(this.scheduleAPI);
    //console.log(this.lineid);
    //console.log(params);
    if (this.scheduleAPI) {
      this.events$ =
      this.http
        .get(this.scheduleAPI, { params })
        .pipe(
          map(({ results }: { results: Schedule[] }) => {
            //console.log(results);
            return results.map((schedule: Schedule) => {
              return {
                title: schedule.title,
                start: new Date(schedule.start_time),//new Date(schedule.start_time),
                end: new Date(schedule.end_time),//moment(schedule.end_time).format("YYYY-MM-DDTHH:mm:ss")
                color: schedule.status === 'Pending' ? new Date(schedule.end_time) > new Date() ? colors.blue : colors.red : colors.green,
                allDay: true,
                meta: {
                  schedule
                }
              };
            });
          })
        );
    }
    //console.log(this.events$);
  }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ schedule: Schedule }>>;
  }): void {
    //console.log('day clicked');
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ schedule: Schedule }>): void {
    //console.log(event.meta.schedule);
    this.openScheduleDialog(event.meta.schedule);
  }
  fun(c) {
    //console.log(c);
    this.openScheduleDialog(c);
  }
  openScheduleDialog(event) {
    //console.log(this.lineid);
    let dialogRef = this.dialog.open(ScheduleDialogComponent, {
      data: { datakey: { event }, lineid: this.lineid },
      width: '650px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //this.fetchEvents();
      this.postScheduleFormData(result);
      //console.log('testsatidsafsadfdsafsdafsadf');
    }
    );
  }

  postScheduleFormData(result) {
    //console.log(result, result.end, result.start, result.lineid);
    //console.log(new Date(result.start),result.end);
    //console.log(moment.)
    this.http.get('configs/apix/api_server.json').subscribe(
      apipath => {
        //console.log(apipath['server']);
        //console.log(this.dataentryservice.ConvertToLocalTimezone(result.start), result.end);
        //console.log(moment(result.start, "Asia/Muscat").format("YYYY-MM-DDTHH:mm"));
        if (apipath['server'] !== undefined) {
          const T = {
            _id: result.scheduleid,
            title: result.title,
            line_id: this.lineid,
            start_time: moment(result.start).format("YYYY-MM-DDTHH:mm:ss"),//moment(result.start).format("YYYY-MM-DD HH:mm:ss"),
            end_time: moment(result.end).format("YYYY-MM-DDTHH:mm:ss"),//moment(result.end).format("YYYY-MM-DD HH:mm:ss"),

            status: result.status,
            activity: [
              {
                machine_name: result.machine_name,
                activity: result.activity,
                byWhom: result.byWhom,
                comment: result.comment
              }
            ]
          };
          console.log(JSON.stringify(T));
          console.log(T);
          this.http.post(apipath['server'] + '/api/manual/schedulemaintanance', T).subscribe(
            (data: any[]) => {
              //console.log(data);

              this.fetchEvents();
              //console.log(data);
              this.openSnackBar("Success", "Records has been added/updated successfully");
              //TO get latest events from DB

              //this.scheduleform.reset();
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

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.lineid = changes.lineid.currentValue;
    //console.log(this.lineid);
    if (changes.lineid.currentValue != null && changes.lineid.currentValue != "") {
      this.fetchEvents();
    }
    //console.log(this.CompanyId);
  }
}
