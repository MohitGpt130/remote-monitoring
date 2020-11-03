
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';

import { DurationToTime } from './../../../_shared/pipes/duration2time/duration2time.pipe';

// import { ChartErrorEvent, ChartEvent, GoogleChartComponent } from 'angular-google-charts';
import { MatDialog } from '@angular/material/dialog';
import {
  ChartReadyEvent,
  ChartErrorEvent,
  ChartSelectEvent,
  ChartMouseOverEvent,
  ChartMouseOutEvent,
  GoogleChartComponent,
} from 'ng2-google-charts';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { StopInputFormComponent } from './stop-input-form';
import { StopVideoComponent } from './stop-video';

import * as moment from 'moment';

const durationToTime = new DurationToTime();

@Component({
  selector: 'app-events-timeline-chart',
  templateUrl: './events-timeline-chart.component.html',
  styleUrls: ['./events-timeline-chart.component.scss']
})

export class EventsTimelineChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  lineID;
  @ViewChild('eventBarChartdiv', { static: false })
  eventBarChartdiv: ElementRef;
  @ViewChild('eventBarChart', { static: false })
  eventBarChart: GoogleChartComponent;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  @ViewChild('vTooltip', { static: false }) vTooltip: ElementRef;


  @Input() config;
  @Input() data;
  eventBarChartData;

  eventBarChartColumnNames = [];
  timelineChart;

  public subscription: Subscription;
  public intervalTimer = interval(10000);

  public mouseMove;
  public stopID = '';
  public machineName = '';
  public stopData;
  public machineState = '';

  eventSelectBar: any;

  query;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e): void {
    this.mouseMove = e;
  }

  constructor(
    private elementRef: ElementRef,
    public dialog: MatDialog,
    breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // breakpointObserver
    //   .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
    //   .subscribe((result) => {
    //     console.log(result)
    //     if (result.matches) {
    //       this.ngOnChanges();
    //     }
    //   });
  }

  ngOnInit(): void {
    this.query = {
      of: moment().format('YYYY-MM-DD'),
    };

    this.getEventData(this.data, this.query);
    if (this.vTooltip !== undefined) {
      this.vTooltip.nativeElement.style.display = 'none';
    }
    this.subscription = this.intervalTimer.subscribe(() => {
      this.getEventData(this.data, this.query);
      console.log("Events time line chart subscription");
     
    });
  }

  ngAfterViewInit(): void {
    // this.elementRef.nativeElement.querySelector('my-element').addEventListener('click', this.onClick.bind(this));
    // document.addEventListener('click', this.onClick.bind(this));
  }

  ngOnChanges(): void {
    if (this.eventBarChartdiv !== undefined) {
      if (
        this.eventBarChartdiv.nativeElement.querySelector(
          '.google-visualization-tooltip'
        ) !== null
      ) {
        this.eventBarChartdiv.nativeElement.querySelector(
          '.google-visualization-tooltip'
        ).parentNode.innerHTML = '<div></div>';
      }
    }
  }

  onResize(event): void {
    const innerWidth = event.target.innerWidth;
    this.getEventData(this.data, this.query);
  }

  onClick(event): void {}

  shown(): void {}

  dummyPPMData(): void {}

  // public onSelect(event: ChartEvent) {
  // }

  public select(event: ChartSelectEvent) {
    // this.eventBarChartdiv.nativeElement.querySelector(
    //   '.google-visualization-tooltip'
    // ).style.display = 'none';

    this.stopID = event.selectedRowValues[1].split('/')[0];
    this.machineName = event.selectedRowValues[1].split('/')[2];
    this.machineState = event.selectedRowValues[1].split('/')[1];
    this.stopData = event;
    if (
      event.selectedRowValues[1].includes('stop')
    ) {
      this.eventBarChartdiv.nativeElement.querySelector(
        '.google-visualization-tooltip'
      ).style.left =
        this.eventBarChartdiv.nativeElement.querySelector(
          '.google-visualization-tooltip'
        ).style.left - 150;
      this.eventBarChartdiv.nativeElement.querySelector(
        '.google-visualization-tooltip'
      ).style.cssText =
        'width: 50px; height: 100px; left: 198.248px; top: 42.496px; z-index: 1000';
      this.vTooltip.nativeElement.style.display = 'flex';
      this.vTooltip.nativeElement.style.height = '50px';
      this.vTooltip.nativeElement.style.top = this.mouseMove.pageY - (this.eventSelectBar && this.eventSelectBar.top ? this.eventSelectBar.top : (70  + 'px'));
      this.vTooltip.nativeElement.style.left = this.mouseMove.pageX + (this.eventSelectBar && this.eventSelectBar.left ? this.eventSelectBar.left : (10  + 'px'));
    } else {
      this.vTooltip.nativeElement.style.display = 'none';
    }
    this.getForm(
      this.stopID,
      this.machineName,
      this.stopData,
      this.machineState
    );
  }

  public hoverTooltip(event: ChartSelectEvent): void {
    this.eventBarChartdiv.nativeElement.querySelector(
      '.google-visualization-tooltip'
    ).style['min-width'] = '300px';
    const eventTime = this.eventBarChartdiv.nativeElement.querySelectorAll(
      '.google-visualization-tooltip'
    )[0].children[2].children[0].children[1].outerText;
    const startTime = moment(eventTime.split('-')[0], 'hh:mm a');
    const endTime = moment(eventTime.split('-')[1], 'hh:mm a');
    const dif = moment.duration(endTime.diff(startTime));
    console.log(startTime, endTime, endTime.diff(startTime), dif, dif.humanize())
    // this.eventBarChartdiv.nativeElement.querySelectorAll(
    //   '.google-visualization-tooltip'
    // )[0].children[2].children[1].children[1].outerText = ' ' + dif.humanize();


    const hrs = moment.utc(endTime.diff(startTime)).format('HH');
    const min = moment.utc(endTime.diff(startTime)).format('mm');
    const sec = moment.utc(endTime.diff(startTime)).format('ss');
    // this.eventBarChartdiv.nativeElement.querySelectorAll(
    //   '.google-visualization-tooltip'
    // )[0].children[2].children[1].children[1].outerText = ' ' + dif.humanize() + ' (' + [((Number(hrs) !== 0) ? (hrs  + 'h') : ''), ((Number(min) !== 0) ? (min  + 'm') : ''), ((Number(sec) !== 0) ? (sec  + 's') : '') ].filter(c => c !== '').join(':') + ')';

    if (this.config && this.config.durationInHumanize) {
      this.eventBarChartdiv.nativeElement.querySelectorAll(
        '.google-visualization-tooltip'
      )[0].children[2].children[1].children[1].outerText = ' ' + dif.humanize();
    } else {
      this.eventBarChartdiv.nativeElement.querySelectorAll(
        '.google-visualization-tooltip'
      )[0].children[2].children[1].children[1].outerText = ' ' + [((Number(hrs) !== 0) ? (hrs  + 'h') : ''), ((Number(min) !== 0) ? (min  + 'm') : ''), ((Number(sec) !== 0) ? (sec  + 's') : '') ].filter(c => c !== '').join(':');
    }
  }

  getEventData(events, query): void {
    // if(this.eventBarChartdiv) {
    //   this.eventBarChartdiv.nativeElement.querySelector(
    //     '.google-visualization-tooltip'
    //   ).style.display = 'none';
    // }
    const eventStarterBar = new Date(
      new Date(
        new Date(query.of ? moment(query.of).format('YYYY-MM-DD') : query.from ? moment(query.from).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')).setHours(
          this.config.eventChartTiming.from.hour,
          this.config.eventChartTiming.from.minute
        )
      )
    );

    const eventStopperBar = new Date(
      new Date(
        new Date(query.of ? moment(query.of).add(1, 'day').format('YYYY-MM-DD')
          : (query.from ? moment(query.from).add(1, 'day').format('YYYY-MM-DD')
            : moment().add(1, 'day').format('YYYY-MM-DD'))).setHours(
            this.config.eventChartTiming.from.hour,
            this.config.eventChartTiming.from.minute
          )
      )
    );
    if (events.length > 0) {
      // this.eventBarChartData = events
      this.eventBarChartData = [
        [
          this.config.machines[events[0].machine_name] &&
          this.config.machines[events[0].machine_name]
            .displayName
            ? this.config.machines[events[0].machine_name]
                .displayName
            : events[0].machine_name,
          '',
          'gray',
          new Date(moment(eventStarterBar).subtract(5, 'seconds').format()),
          eventStarterBar,
          '',
        ],
        [
          this.config.machines[events[0].machine_name] &&
          this.config.machines[events[0].machine_name]
            .displayName
            ? this.config.machines[events[0].machine_name]
                .displayName
            : events[0].machine_name,
          '',
          'gray',
          new Date(moment(eventStopperBar).subtract(5, 'seconds').format()),
          eventStopperBar,
          '',
        ],
      ];
      console.log(this.eventBarChartData)
      if (events.length > 0) {
        events.forEach((stopEvent) => {
          if (events.length > 0 && (new Date(stopEvent.start_time).getTime() > eventStarterBar.getTime() && new Date(stopEvent.end_time).getTime() < eventStopperBar.getTime())) {
            this.eventBarChartData.push([
              this.config.machines &&
              this.config.machines[stopEvent.machine_name]
                .displayName
                ? this.config.machines[stopEvent.machine_name]
                    .displayName
                : stopEvent.machine_name,
              stopEvent._id + '/' + stopEvent.stop_name + '/' + stopEvent.machine_name,
              this.config.statusColors &&
              this.config.statusColors[stopEvent.stop_name]
                ? this.config.statusColors[stopEvent.stop_name].color
                : 'gray',
              new Date(stopEvent.start_time).getTime() < eventStarterBar.getTime() ? eventStarterBar :  new Date(stopEvent.start_time),
              new Date(stopEvent.end_time).getTime() > eventStopperBar.getTime() ? eventStopperBar :  new Date(stopEvent.end_time),
              // new Date(stopEvent.start_time),
              // new Date(stopEvent.end_time),
              '',
            ]);
          }
        });
        if (this.eventBarChartData !== undefined) {

          this.timelineChart = {
            chartType: 'Timeline',
            dataTable: [
              this.eventBarChartColumnNames,
              ...this.eventBarChartData,
            ],
            options: this.config.eventBarChartOptions,
            // animation: {
            //   duration: 5000,
            //   easing: 'out',
            //   startup: true,
            // },
            tooltip: { trigger: 'selection' },
          };
          console.log(this.timelineChart);
        }
      } else {
      }
    } else {
    }
  }

  getElement(event): void {}

  getForm(id, machineName, stopData, machineState): void {
    const dialogRef = this.dialog.open(StopInputFormComponent, {
      width: '600px',
      height: '700px',
      data: {
        dataKey: {
          id,
          machine: machineName,
          data: stopData,
          machineState,
          line_id: this.lineID,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  getVideo(id, machineName, stopData): void {
    const dialogRef = this.dialog.open(StopVideoComponent, {
      width: '500px',
      height: '700px',
      data: {
        dataKey: { id, machine: machineName, data: stopData },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  getDetails(): void {}
  RefreshChart(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
