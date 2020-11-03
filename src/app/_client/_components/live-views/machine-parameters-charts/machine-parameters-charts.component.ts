import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnChanges,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
import { BehaviorSubject, Observable } from 'rxjs';
import { StopInputFormComponent } from './stop-input-form/stop-input-form.component';
import { StopVideoComponent } from './stop-video/stop-video.component';

@Component({
  selector: 'app-machine-parameters-charts',
  templateUrl: './machine-parameters-charts.component.html',
  styleUrls: ['./machine-parameters-charts.component.scss'],
})
export class MachineParametersChartsComponent
  implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('eventBarChartdiv', { static: false })
  eventBarChartdiv: ElementRef;
  @ViewChild('eventBarChart', { static: false })
  eventBarChart: GoogleChartComponent;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  @ViewChild('vTooltip', { static: false }) vTooltip: ElementRef;


  @Input() machines;
  @Input() gotPieChartData = true;
  @Input() pieChartColumnNames = ['Stopper', 'Duration'];
  @Input() pieChartsData;
  @Input() lineChartData;
  @Input() statusColors;
  @Input() pieChartOptions = {
    height: 100,
    width: 100,
    colors: [
      '#01af4e',
      '#666699',
      '#9dc0e8',
      '#b37700',
      '#fe0100',
      '#FFFF33',
      '#FFA500',
      '#ff33cc',
      '#a3a375',
    ],
    legend: 'none',
    is3D: true,
  };
  @Input() gotEventChartData = true;
  @Input() eventBarChartColumnNames = [
    { type: 'string', id: 'Position' },
    { type: 'string', id: 'Type' },
    { type: 'string', role: 'style' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
    {
      type: 'string',
      label: 'Tooltip Chart',
      role: 'tooltip',
      p: { html: true },
    },
  ];
  @Input() eventBarChartData;
  @Input() eventBarChartOptions = {
    height: 150,
    hAxis: { title: 'Time', format: 'HH:mm' },
    legend: { alignment: 'center', position: 'top' },
    tooltip: { isHtml: true },
    timeline: { showBarLabels: false },
    vAxis: { minValue: 0 },
    isStacked: true,
  };

  timelineChart;
  lineChart;
  pieCharts = [];

  pieChart = {
    Parameters: [],
    data: {
      originalData: [],
      plotingData: [],
      machineWiseData: [],
      parameterWiseData: [],
    },
    Options: [],
  };
  updated = false;

  lineCharts = [];
  public mouseMove;
  public stopID = '';
  public machineName = '';
  public stopData;
  public machineState = '';

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    this.mouseMove = e;
  }

  constructor(
    private elementRef: ElementRef,
    public dialog: MatDialog,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        if (result.matches) {
          this.ngOnChanges();
        }
      });
  }

  ngOnInit() {
    // // const wrapper = this.eventBarChartdiv.wrapper;
    // // wrapper.draw(myAdvancedData);
    // if (this.vTooltip !== undefined)
    //   this.vTooltip.nativeElement.style.display = 'none';

    // if (this.eventBarChartData !== undefined) {
    //   this.timelineChart = {
    //     chartType: 'Timeline',
    //     dataTable: [this.eventBarChartColumnNames, ...this.eventBarChartData],
    //     options: this.eventBarChartOptions,
    //     // animation: {
    //     //   duration: 5000,
    //     //   easing: 'out',
    //     //   startup: true
    //     // },
    //     tooltip: { trigger: 'selection' },
    //   };
    // }
    // if (this.pieChartsData !== undefined) {
    //   try {
    //     for (let i = 0; i < Object.keys(this.machines).length; i++) {
    //       var pieChartData: [] = this.pieChartsData[
    //         Object.keys(this.machines)[i]
    //       ]['plotingData'];
    //       if (Object.keys(this.machines)[i] !== 'vision') {
    //         this.pieCharts[i] = {
    //           chartType: 'PieChart',
    //           pieChartColumnName: this.pieChartColumnNames,
    //           title: Object.keys(this.machines)[i],
    //           dataTable: [this.pieChartColumnNames, ...pieChartData],
    //           options: this.pieChartOptions,
    //         };
    //       }
    //     }
    //   } catch (error) {}
    // }

    // if (this.lineChartData !== undefined) {
    //   this.lineChart = {
    //     chartType: 'LineChart',
    //     dataTable: this.lineChartData['filler']['plotingData'],
    //     options: {
    //       title: 'Filler BMP Chart',
    //       height: 150,
    //       hAxis: {
    //         title: 'Time',
    //         format: 'ss',
    //       },
    //       // legend: { position: 'bottom' }
    //     },
    //   };
    // }

    // // this.pieChart = {
    // //   chartType: 'Timeline',
    // //   dataTable: [
    // //     this.eventBarChartColumnNames,
    // //     ...this.eventBarChartData
    // //   ], options:this.eventBarChartOptions
    // // };
  }

  ngAfterViewInit() {
    // this.elementRef.nativeElement.querySelector('my-element').addEventListener('click', this.onClick.bind(this));
    // document.addEventListener('click', this.onClick.bind(this));
  }

  ngOnChanges() {
    if (this.eventBarChartdiv !== undefined) {
      if (
        this.eventBarChartdiv.nativeElement.querySelector(
          '.google-visualization-tooltip'
        ) !== null
      )
        this.eventBarChartdiv.nativeElement.querySelector(
          '.google-visualization-tooltip'
        ).parentNode.innerHTML = '<div></div>';
    }

    if (this.eventBarChartData !== undefined) {
      this.timelineChart = {
        chartType: 'Timeline',
        dataTable: [this.eventBarChartColumnNames, ...this.eventBarChartData],
        options: this.eventBarChartOptions,
        animation: {
          duration: 50000,
          easing: 'out',
          startup: true,
        },
        tooltip: { trigger: 'selection' },
      };
      this.updated = !this.updated;
    }

    console.log(this.machines);
    console.log(this.pieChartsData);

    if (this.pieChartsData !== undefined) {
      for (let i = 0; i < Object.keys(this.pieChartsData).length; i++) {
        var pieChartData: [] = this.pieChartsData[
          Object.keys(this.pieChartsData)[i]
        ]['plotingData'];
        if (Object.keys(this.pieChartsData)[i] !== 'vision') {
          this.pieCharts[i] = {
            chartType: 'PieChart',
            pieChartColumnName: this.pieChartColumnNames,
            title: Object.keys(this.pieChartsData)[i],
            dataTable: [this.pieChartColumnNames, ...pieChartData],
            options: this.pieChartOptions,
          };
        }
      }
    }
  }

  onClick(event) {}

  shown() {}

  dummyPPMData() {}

  // public onSelect(event: ChartEvent) {
  // }

  public select(event: ChartSelectEvent) {
    if (
      event.selectedRowValues[1].includes('stop') &&
      !event.selectedRowValues[1].includes('manual_stop')
    ) {
      this.stopID = event.selectedRowValues[1].split('/')[1];
      this.machineName = event.selectedRowValues[1].split('/')[3];

      this.machineState = event.selectedRowValues[1].split('/')[2];
      this.stopData = event;

      this.getForm(
        this.stopID,
        this.machineName,
        this.stopData,
        this.machineState
      );
    } else {
      this.stopID = event.selectedRowValues[1].split('/')[0];
      this.machineName = event.selectedRowValues[1].split('/')[2];
      this.stopData = event;
      this.machineState = event.selectedRowValues[1].split('/')[1];
      //this.vTooltip.nativeElement.style.display = 'none';
      this.getForm(
        this.stopID,
        this.machineName,
        this.stopData,
        this.machineState
      );
    }
    this.eventBarChartdiv.nativeElement.querySelector(
      '.google-visualization-tooltip'
    ).style.display = 'none';
  }

  getElement(event) {}

  getForm(id, machineName, stopData, machineState) {
    console.log(stopData);
    console.log(JSON.stringify(stopData));

    const dialogRef = this.dialog.open(StopInputFormComponent, {
      width: '600px',
      height: '700px',
      data: {
        dataKey: {
          id,
          machine: machineName,
          data: stopData,
          machineState,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getVideo(id, machineName, stopData) {
    const dialogRef = this.dialog.open(StopVideoComponent, {
      width: '500px',
      height: '700px',
      data: {
        dataKey: { id: id, machine: machineName, data: stopData },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getDetails() {}
  RefreshChart() {
    
    }
}
