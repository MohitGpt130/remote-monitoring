import { ManualEntryService } from './../../manual-entry.service';

import { getDate } from 'date-fns';
import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-event-chart-history',
  templateUrl: './event-chart-history.component.html',
  styleUrls: ['./event-chart-history.component.scss'],
})
export class EventChartHistoryComponent implements OnInit {
  tomorrow = new Date();
  eventchartform: FormGroup;
  //2 formcontrols used in page as below
  shiftname: FormControl;
  date: FormControl;
  type: FormControl;

  vEventChartData;
  fromDateShift;
  toDateShift;
  allLinkedmachines;
  machines;
  Equipments = [];

  eventDataByMachines;
  faultDescritions;
  statusColors;
  machineWiseFaults = {};
  parameterWiseMachinesData = {};
  machineWiseFaultsTableData = {};
  criticalMachine;
  criticalMachineParameters;
  pieCharts = [];
  pieChartsData = {};

  Shift = [];
  updated = false;

  eventChart = {
    Parameters: [],
    data: {
      originalData: [],
      plotingData: [],
      machineWiseData: [],
      parameterWiseData: [],
    },
    Options: [],
  };
  pieChartColumnNames = ['Stopper', 'Duration'];

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
  //Parameters
  eventBarChartColumnNames = [
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
  eventBarChartData;
  eventBarChartOptions = {
    height: 225,
    width: window.screen.width - 50,
    chartArea: { width: '100%' },
    hAxis: { title: 'Time', format: 'HH:mm' },
    legend: 'none',
    tooltip: { isHtml: true },
    timeline: { showBarLabels: false },
    vAxis: { minValue: 0 },
    isStacked: true,
  };

  pieChartOptions = {
    height: 100,
    width: 100,
    colors: [
      '#01af4e',
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
  timelineChart;

  constructor(
    protected dataSourceService: ManualEntryService,
    protected httpClient: HttpClient,
    protected datePipe: DatePipe
  ) {}

  createFormControlsEventChartHistory() {
    this.shiftname = new FormControl(null, Validators.required);
    this.date = new FormControl(null, Validators.required);
    this.type = new FormControl(null, Validators.required);
  }

  createEventChartForm() {
    this.eventchartform = new FormGroup({
      shiftname: this.shiftname,
      date: this.date,
      type: this.type,
    });
  }

  ngOnInit() {
    this.createFormControlsEventChartHistory();
    this.createEventChartForm();
    this.GetShiftData();
    this.vEventChartData = [];
    this.DesignChart('', '', '');
  }

  GetShiftData() {
    this.Shift = [];
    this.dataSourceService.GetServerAPIPath().subscribe((serverdetails) => {
      this.dataSourceService
        .GetShiftDetails(serverdetails['server'], serverdetails['line_id'])
        .subscribe((shiftdata: any[]) => {
          console.log(shiftdata);
          for (let i = 0; i < shiftdata.length; i++) {
            const c = shiftdata[i];
            let a: string[] = [''];
            a.push(c._id);
            a.push(c.shift);
            //console.log(a);
            this.Shift.push(a);
          }
        });
    });
  }

  DesignChart(Shiftname, ShiftDate, Type) {
    //Default search by Shift A
    // if (Shiftname === "") {
    //   this.shiftname.setValue('Shift A');
    //   Shiftname = 'Shift A';
    // }
    // else {
    //   Shiftname = this.shiftname.value;
    // }

    // if (ShiftDate === "") {
    //   this.date.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    //   ShiftDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // }
    // else {
    //   ShiftDate = this.datePipe.transform(ShiftDate, 'yyyy-MM-dd')
    // }
    if (Type === '') {
      this.type.setValue('machine');
      Type = 'machine';
    } else {
      Type = this.type.value;
    }

    this.dataSourceService.GetServerAPIPath().subscribe((serverdetails) => {
      //this.machines = serverdetails['machines'];
      console.log(serverdetails['server']);
      if (serverdetails['server'] !== undefined) {
        this.dataSourceService
          .GetPreviousShift(serverdetails['server'])
          .subscribe((shiftdetails) => {
            if (ShiftDate === '') {
              console.log(shiftdetails['current_shift'].CurrentShift);
              var d1 = moment(
                new Date(
                  this.dataSourceService.ConvertToLocalTimezone(
                    new Date(shiftdetails['current_shift'].current_timeStamp)
                  )
                ),
                'HH:mm:ss'
              );
              // + new Date(shiftdetails['current_shift'].shiftStartTime).getTime());// - new Date(shiftdetails['current_shift'].current_timeStamp.shiftStartTime));
              var d2 = moment(
                new Date(shiftdetails['current_shift'].shiftStartTime),
                'HH:mm:ss'
              );
              console.log(d2, d1);
              console.log(d1.diff(d2, 'minutes'));
              if (d1.diff(d2, 'minutes') >= 60) {
                console.log(new Date(shiftdetails['pre_shift'].shiftStartTime));
                console.log(
                  this.datePipe.transform(
                    new Date(shiftdetails['pre_shift'].shiftStartTime),
                    'yyyy-MM-dd'
                  )
                );
                ShiftDate = this.datePipe.transform(
                  new Date(shiftdetails['pre_shift'].shiftStartTime),
                  'yyyy-MM-dd'
                );
                Shiftname = shiftdetails['pre_shift'].shift;

                this.tomorrow = new Date(
                  shiftdetails['pre_shift'].shiftStartTime
                );

                this.date.setValue(
                  new Date(shiftdetails['pre_shift'].shiftStartTime)
                );
              } else {
                ShiftDate = this.datePipe.transform(
                  new Date(shiftdetails['pre_pre_shift'].shiftStartTime),
                  'yyyy-MM-dd'
                );
                Shiftname = shiftdetails['pre_pre_shift'].shift;

                this.tomorrow = new Date(
                  shiftdetails['pre_pre_shift'].shiftStartTime
                );

                this.date.setValue(
                  new Date(shiftdetails['pre_pre_shift'].shiftStartTime)
                );
              }
            } else {
              ShiftDate = this.datePipe.transform(
                this.date.value,
                'yyyy-MM-dd'
              );
              Shiftname = this.shiftname.value;
            }
            console.log(ShiftDate, new Date(ShiftDate));
            //this.tomorrow = new Date(ShiftDate);
            this.shiftname.setValue(Shiftname);
            //this.date.setValue(ShiftDate);
            //this.type.setValue(Type);

            this.dataSourceService.GetDatapattern().subscribe((res) => {
              console.log(res);
              this.statusColors = res['status_color'];
              console.log(this.statusColors);
              var ColourArray = [];
              for (var o in this.statusColors) {
                ColourArray.push(this.statusColors[o]['color']);
              }
              console.log(ColourArray);
              this.pieChartOptions.colors = ColourArray;

              this.eventChart.Parameters = res['event_chart']['parameters'];
              this.pieChart.Parameters = res['pie_chart']['parameters'];
              this.faultDescritions = res['faultDescritions'];
              this.criticalMachine = res['critical_machine']['name'];
              this.criticalMachineParameters =
                res['critical_machine']['parameters'];
              console.log(
                serverdetails['line_id'],
                serverdetails['server'],
                Type
              );
              this.dataSourceService
                .GetEquipmentdata(
                  serverdetails['line_id'],
                  serverdetails['server'],
                  Type
                )
                .subscribe((equipments) => {
                  this.dataSourceService
                    .GetEventDataForChart(
                      serverdetails['server'],
                      ShiftDate,
                      Shiftname,
                      Type,
                      serverdetails['line_id']
                    )
                    .subscribe((res: any[]) => {
                      console.log(res);
                      console.log(res['data']);
                      this.generateChartStartEnd(
                        res['shiftStartime'],
                        res['shiftEndime'],
                        res['data'],
                        equipments
                      );
                      this.generateCharts(res['data'], Type);
                    });
                });
            });
          });
      }
    });
  }

  generateChartStartEnd(fromDateShift, toDateShift, machinedata, equipments) {
    this.vEventChartData = [];
    this.Equipments = [];
    this.machines = [];
    //Filtering  all those machines which are send by backend.
    console.log(machinedata);
    this.allLinkedmachines = machinedata
      .map((item) => item.display_name)
      .filter((value, index, self) => self.indexOf(value) === index);
    console.log(equipments);
    this.machines = equipments;

    for (let i = 0; i < Object.keys(equipments).length; i++) {
      this.Equipments.push(equipments[i]['display_name']);
      //console.log(equipments[i]['display_name']);
    }

    //Arranging/Overwriting machines series.
    this.allLinkedmachines = this.Equipments.filter((m) =>
      this.allLinkedmachines.includes(m)
    );

    console.log(this.allLinkedmachines);
    for (let i = 0; i < this.allLinkedmachines.length; i++) {
      var setStart = [
        this.allLinkedmachines[i], //Object.keys(this.machines)[i],
        '_',
        'gray',
        new Date(
          new Date(fromDateShift).setMinutes(
            new Date(fromDateShift).getMinutes() - 15
          )
        ),
        new Date(
          new Date(fromDateShift).setMinutes(
            new Date(fromDateShift).getMinutes() - 14
          )
        ),
        '',
      ];
      this.vEventChartData.push(setStart);

      var setEnd = [
        this.allLinkedmachines[i], //Object.keys(this.machines)[i],
        '_',
        'gray',
        new Date(
          new Date(toDateShift).setMinutes(
            new Date(toDateShift).getMinutes() + 14
          )
        ),
        new Date(
          new Date(toDateShift).setMinutes(
            new Date(toDateShift).getMinutes() + 15
          )
        ),
        '',
      ];
      this.vEventChartData.push(setEnd);
    }
  }

  generateCharts(data: any[], Type) {
    this.eventDataByMachines = {};
    for (let i = 0; i < data.length; i++) {
      var stopName = data[i]['stop_name'];
      if (
        data[i]['stop_name'].includes('fault') &&
        !data[i]['stop_name'].includes('manual_stop')
      )
        stopName = 'stop';

      if (this.eventDataByMachines[data[i]['display_name']] === undefined)
        this.eventDataByMachines[data[i]['display_name']] = {};
      if (
        this.eventDataByMachines[data[i]['display_name']][stopName] ===
        undefined
      )
        this.eventDataByMachines[data[i]['display_name']][stopName] = {};
      if (
        this.eventDataByMachines[data[i]['display_name']][stopName]['data'] ===
        undefined
      )
        this.eventDataByMachines[data[i]['display_name']][stopName][
          'data'
        ] = [];
      if (
        this.eventDataByMachines[data[i]['display_name']][stopName]['count'] ===
        undefined
      )
        this.eventDataByMachines[data[i]['display_name']][stopName][
          'count'
        ] = 0;
      if (
        this.eventDataByMachines[data[i]['display_name']][stopName][
          'duration'
        ] === undefined
      )
        this.eventDataByMachines[data[i]['display_name']][stopName][
          'duration'
        ] = 0;

      this.eventDataByMachines[data[i]['display_name']][stopName]['data'].push(
        data[i]
      );
      this.eventDataByMachines[data[i]['display_name']][stopName][
        'fault_name'
      ] = stopName;
      this.eventDataByMachines[data[i]['display_name']][stopName]['count'] += 1;
      this.eventDataByMachines[data[i]['display_name']][stopName][
        'duration'
      ] += Math.round(
        (new Date(data[i]['end_time']).getTime() -
          new Date(data[i]['start_time']).getTime()) /
          1000
      );

      if (
        Object.keys(this.eventChart.Parameters).indexOf(data[i]['stop_name']) >
          -1 ||
        (data[i]['stop_name'].indexOf('fault') > -1 &&
          data[i]['stop_name'].indexOf('manual_stop') === -1)
      ) {
        if (data[i]['stop_name'].indexOf('fault_') > -1) {
          var event = [
            data[i]['display_name'],
            data[i]['fault_name'], //this.faultDescritions[data[i]['machine_name']][data[i]['stop_name'].replace('stop', 'fault')] === undefined ? '' : this.faultDescritions[data[i]['machine_name']][data[i]['stop_name'].replace('stop', 'fault')].short + '/' + data[i]['_id'] + '/' + data[i]['stop_name'] + '/' + data[i]['machine_name'],
            this.statusColors['stop']['color'],
            new Date(
              this.dataSourceService.ConvertToLocalTimezone(
                data[i]['start_time']
              )
            ), //new Date(new Date(data[i]['start_time']).toLocaleString("en-US", { timeZone: "Asia/Muscat" })),
            new Date(
              this.dataSourceService.ConvertToLocalTimezone(data[i]['end_time'])
            ), //new Date(new Date(data[i]['end_time']).toLocaleString("en-US", { timeZone: "Asia/Muscat" })),
            data[i]['video_url'] !== undefined ? data[i]['video_url'] : '',
          ];
          this.vEventChartData.push(event);
        } else if (Type === 'machine') {
          if (
            data[i]['stop_name'].indexOf('fault_') === -1 &&
            !(
              data[i]['machine_name'] !== this.criticalMachine &&
              data[i]['stop_name'] === 'ready'
            )
          ) {
            //console.log(data[i]['stop_name'].indexOf('fault_'));
            //console.log(this.statusColors[data[i]['stongp_name']]['color']);
            var event = [
              data[i]['display_name'], //data[i]['display_name'],
              // data[i]['display_name']+'_'+data[i]['stop_name']+'_'+data[i]['_id'],
              data[i]['stop_name'] + '/' + data[i]['display_name'],
              this.statusColors[data[i]['stop_name']]['color'],
              new Date(
                this.dataSourceService.ConvertToLocalTimezone(
                  new Date(data[i]['start_time'])
                )
              ),
              new Date(
                this.dataSourceService.ConvertToLocalTimezone(
                  new Date(data[i]['end_time'])
                )
              ), //.toLocaleString("en-US", { timeZone: "Asia/Muscat" })),
              data[i]['video_url'] !== undefined ? data[i]['video_url'] : '',
            ];
            this.vEventChartData.push(event);
          }
        } else {
          if (
            data[i]['stop_name'].indexOf('fault_') === -1 &&
            data[i]['stop_name'] !== 'ready'
          ) {
            var event = [
              data[i]['display_name'], //data[i]['display_name'],
              // data[i]['display_name']+'_'+data[i]['stop_name']+'_'+data[i]['_id'],
              data[i]['stop_name'] + '/' + data[i]['display_name'],
              this.statusColors[data[i]['stop_name']]['color'],
              new Date(
                this.dataSourceService.ConvertToLocalTimezone(
                  new Date(data[i]['start_time'])
                )
              ),
              new Date(
                this.dataSourceService.ConvertToLocalTimezone(
                  new Date(data[i]['end_time'])
                )
              ), //.toLocaleString("en-US", { timeZone: "Asia/Muscat" })),
              data[i]['video_url'] !== undefined ? data[i]['video_url'] : '',
            ];
            this.vEventChartData.push(event);
          }
        }
      }
    }
    console.log(this.vEventChartData);

    var machineWisePlotingData = {};
    this.machineWiseFaults = {};

    this.parameterWiseMachinesData['manual_stop'] = {};
    var machineWiseManualStops = {};
    console.log(this.machines);
    this.allLinkedmachines = data
      .map((item) => item.display_name)
      .filter((value, index, self) => self.indexOf(value) === index);
    //this.allLinkedmachines = Object.keys(this.machines).filter((m) => this.allLinkedmachines.includes(m));
    this.machines = this.machines.filter((i) =>
      this.allLinkedmachines.includes(i.display_name)
    );
    console.log(this.machines);
    //this.machines = Object.keys(this.machines).filter(key => this.allLinkedmachines.includes(key)).reduce((obj, key) => { obj[key] = this.machines[key]; return obj; }, {});

    //console.log(this.machines[Object.keys(this.machines)[i]]['display_name']);
    for (let i = 0; i < Object.keys(this.machines).length; i++) {
      //console.log(this.machines[Object.keys(this.machines)[i]]['display_name'])
      this.machineWiseFaults[
        this.machines[Object.keys(this.machines)[i]]['display_name']
      ] = [];

      if (
        machineWisePlotingData[
          this.machines[Object.keys(this.machines)[i]]['display_name']
        ] === undefined
      )
        machineWisePlotingData[
          this.machines[Object.keys(this.machines)[i]]['display_name']
        ] = [];

      this.pieChartsData[
        this.machines[Object.keys(this.machines)[i]]['display_name']
      ] = {};
      var machineData = this.eventDataByMachines[
        this.machines[Object.keys(this.machines)[i]]['display_name']
      ];
      console.log(this.eventDataByMachines);
      if (machineData === undefined)
        machineWisePlotingData[
          this.machines[Object.keys(this.machines)[i]]['display_name']
        ].push(['pdt', 12]);
      else {
        Object.keys(
          this.eventDataByMachines[
            this.machines[Object.keys(this.machines)[i]]['display_name']
          ]
        ).filter((s) => {
          // this.parameterWiseMachinesData['manual_stop'][this.machines[Object.keys(this.machines)[i]]['display_name']] = '-'
          s.includes('fault_')
            ? this.machineWiseFaults[
                this.machines[Object.keys(this.machines)[i]]['display_name']
              ].push(
                this.eventDataByMachines[
                  this.machines[Object.keys(this.machines)[i]]['display_name']
                ][s]
              )
            : '';
          if (s.includes('manual_stop')) {
            if (this.machineWiseFaultsTableData['manual_stops'] === undefined)
              this.machineWiseFaultsTableData['manual_stops'] = {
                count: {},
                duration: {},
              };

            this.machineWiseFaultsTableData['manual_stops']['count'][
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ] = this.eventDataByMachines[
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ][s]['count'];
            this.machineWiseFaultsTableData['manual_stops']['duration'][
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ] = this.eventDataByMachines[
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ][s]['duration'];

            machineWiseManualStops[
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ] = this.eventDataByMachines[
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ][s];
            this.parameterWiseMachinesData['manual_stop'][
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ] =
              machineWiseManualStops[
                this.machines[Object.keys(this.machines)[i]]['display_name']
              ]['count'];
          }
        });

        for (let j = 0; j < Object.keys(this.pieChart.Parameters).length; j++)
          if (
            Object.keys(machineData).indexOf(
              Object.keys(this.pieChart.Parameters)[j]
            ) > -1
          )
            machineWisePlotingData[
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ].push([
              Object.keys(this.pieChart.Parameters)[j],
              parseFloat(
                parseFloat(
                  (
                    parseInt(
                      machineData[Object.keys(this.pieChart.Parameters)[j]]
                        .duration
                    ) /
                    (60 * 60)
                  ).toString()
                ).toFixed(2)
              ),
            ]);
          else
            machineWisePlotingData[
              this.machines[Object.keys(this.machines)[i]]['display_name']
            ].push([Object.keys(this.pieChart.Parameters)[j], 0]);
      }
      //console.log(machineWisePlotingData[this.machines[Object.keys(this.machines)[i]]['display_name']]);
      this.pieChartsData[
        this.machines[Object.keys(this.machines)[i]]['display_name']
      ]['plotingData'] =
        machineWisePlotingData[
          this.machines[Object.keys(this.machines)[i]]['display_name']
        ];
      console.log(machineWisePlotingData);
      console.log(this.pieChartsData);
    }

    var machineWiseSortedKeys = {
      count: {},
      duration: {},
    };

    for (let j = 0; j < Object.keys(this.machineWiseFaults).length; j++) {
      machineWiseSortedKeys.count[
        Object.keys(this.machineWiseFaults)[j]
      ] = this.machineWiseFaults[Object.keys(this.machineWiseFaults)[j]].sort(
        (a, b) => {
          return b.count - a.count;
        }
      );
    }

    console.log(this.vEventChartData);
    console.log(this.eventBarChartOptions);

    // this.timelineChart.dataTable =[];

    // this.timelineChart.dataTable= [
    //   this.eventBarChartColumnNames,
    //   ...this.vEventChartData,
    // ]
    //this.timelineChart = null;
    //this.timelineChart = Object.create(this.timelineChart);
    //this.timelineChart = Object.assign([],this.timelineChart);

    //this.timelineChart = Object.create(this.timelineChart);
    this.timelineChart = {
      chartType: 'Timeline',
      dataTable: [this.eventBarChartColumnNames, ...this.vEventChartData],
      options: this.eventBarChartOptions,
      animation: {
        duration: 50000,
        easing: 'out',
        startup: true,
      },
      tooltip: { trigger: 'selection' },
    };

    this.timelineChart = Object.assign([], this.timelineChart);
    this.updated = true;
    //this.updateChartData(this.vEventChartData);

    // this.timelineChart.dataTable = [
    //   this.eventBarChartColumnNames,
    //   ...this.vEventChartData,
    // ];

    console.log(this.timelineChart);
    if (this.pieChartsData !== undefined) {
      for (let i = 0; i < Object.keys(this.machines).length; i++) {
        var pieChartData: [] = this.pieChartsData[
          this.machines[Object.keys(this.machines)[i]]['display_name']
        ]['plotingData'];
        this.pieCharts[i] = {
          chartType: 'PieChart',
          pieChartColumnName: this.pieChartColumnNames,
          title: this.machines[Object.keys(this.machines)[i]]['display_name'],
          dataTable: [this.pieChartColumnNames, ...pieChartData],
          options: this.pieChartOptions,
        };
      }
    }
  }

  updateChartData(newData: Array<Array<string>>) {
    this.timelineChart = newData;
    this.updated = true;
  }

  SubmitChanges() {
    console.log(this.shiftname.value, this.date.value, this.type.value);
    this.updated = false;
    this.DesignChart(this.shiftname.value, this.date.value, this.type.value);
  }
}
