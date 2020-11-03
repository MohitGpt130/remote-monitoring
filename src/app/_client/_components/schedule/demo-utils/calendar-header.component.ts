import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
    selector: 'mwl-demo-utils-calendar-header',
    template: `
  <div style="background-color: #283593;color: white;">
  <div fxLayout="row"  fxLayout.xs="column" fxLayoutAlign="space-between center" class="w-100">
      <div >
          <button mat-icon-button mwlCalendarPreviousView [view]="view" [(viewDate)]="viewDate"
(viewDateChange)="viewDateChange.next(viewDate)">
              <mat-icon>chevron_left</mat-icon>
              <!-- <mat-icon>chevron_right</mat-icon> -->
          </button>
          <button mat-icon-button mwlCalendarToday [(viewDate)]="viewDate"
(viewDateChange)="viewDateChange.next(viewDate)">
              <mat-icon>today</mat-icon>
          </button>
          <button mat-icon-button mwlCalendarNextView [view]="view" [(viewDate)]="viewDate"
(viewDateChange)="viewDateChange.next(viewDate)">
              <!-- <mat-icon >chevron_left</mat-icon> -->
              <mat-icon>chevron_right</mat-icon>
          </button>
      </div>
      <h2>{{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}</h2>
      <div class="">
          <button mat-icon-button (click)="viewChange.emit('month')" [class.active]="view === 'month'">
              <mat-icon>view_comfy</mat-icon>
          </button>
          <button mat-icon-button (click)="viewChange.emit('week')"
[class.active]="view === 'week'">
              <mat-icon>view_week</mat-icon>
          </button>
          <button mat-icon-button (click)="viewChange.emit('day')"
[class.active]="view === 'day'">
              <mat-icon>view_day</mat-icon>
          </button>
          <button mat-icon-button (click)="vc.emit(null)">
              <mat-icon>add</mat-icon>
          </button>
          <button mat-icon-button (click)="viewChange.emit('month')" [class.active]="view === 'month'">
              <mat-icon>refresh</mat-icon>
          </button>
      </div>
  </div>
</div>
    <br />
  `
})
export class CalendarHeaderComponent {
    @Input() view: CalendarView | 'month' | 'week' | 'day';

    @Input() viewDate: Date;

    @Input() locale: string = 'en';

    @Output() viewChange: EventEmitter<string> = new EventEmitter();

    @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

    @Output() vc: EventEmitter<string> = new EventEmitter();

}
