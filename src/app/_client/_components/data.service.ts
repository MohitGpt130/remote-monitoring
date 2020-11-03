import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { addDays } from 'date-fns';
import { ManualEntryService } from './manual-entry.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = 'http://192.168.2.3:3000';

  apiServer = {
    pi: 'http://13.126.173.64:1200',
    apis: {
      skuAPI: {
        name: 'http://13.126.173.64:1200/api/sku',
        interval: 5,
      },
      shiftAPI: {
        name: 'http://13.126.173.64:1200/api/shift/shift/all',
        interval: 5,
      },
      eventsAPI: {
        name: 'http://13.126.173.64:1200/api/stops/new',
        interval: 5,
      },
      alarmsAPI: {
        name: 'http://13.126.173.64:1200/api/alarm',
        interval: 5,
      },
      connectionAPI: {
        name: 'http://13.126.173.64:1200/api/connection',
        interval: 5,
      },
      bmpAPI: {
        name: 'http://13.126.173.64:1200/api/history/bpm',
        serverAPI: 'http://103.205.66.73:1700/api/history/bpm',
        interval: 5,
      },
    },
  };

  viewLogs: boolean;

  statusColors;

  apiData = {
    shiftData: {},
    skuData: {},
    eventData: {},
    bmpData: {},
    connectionStatus: {},
    alarmData: {},
  };

  apiDataService = {
    shiftDataService: undefined,
    skuDataService: undefined,
    eventDataService: undefined,
    //bmpDataService: undefined,
    connectionStatusService: undefined,
    alarmDataService: undefined,
  };

  machines;
  allLinemachines;
  filteredObject = {};
  eventDataByMachines = {};
  vEventChartData = [];
  faultDescritions;

  parameterWiseMachinesData = {};
  parameterWiseMachinesTableData = {};
  machineWiseFaultsTableData = {};
  machineWiseFaults = {};

  tableParameters;

  criticalMachine = 'cam_blister';
  criticalMachineData = [];
  criticalMachineParameters: {};

  allLinkedmachines;

  headerInfo = {
    currentShift: '',
    currentTime: '',
    shiftTimings: '',
    currentOperator: '',
  };

  hits = [];

  currentActiveAlarms = {};
  currentFirstFault = {};

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

  pieCharts = {};

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

  lineCharts = {};

  lineChart = {
    Parameters: [],
    data: {
      originalData: [],
      plotingData: [],
      machineWiseData: [],
      parameterWiseData: [],
    },
    Options: [],
  };

  observer: Observer<any>;
  observers = {
    eventChartDataAsObserver: this.observer,
    pieChartsDataAsObserver: this.observer,
  };

  api_server;

  constructor(
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    protected manualentryservice: ManualEntryService
  ) {
    this.httpClient.get('configs/apix/api_server.json').subscribe((data) => {
      this.api_server = data;
      if (data['server']) {
      } else {
        //console.log('missing server api json file');
      }
    });
  }

  getInit(data) {
    this.apiServer.pi = data['server'];

    this.apiServer.apis.skuAPI.name =
      this.apiServer.pi + data['apis']['shift']['name'];
    this.apiServer.apis.skuAPI.interval = parseInt(
      data['apis']['shift']['interval']
    );

    this.apiServer.apis.shiftAPI.name =
      this.apiServer.pi + data['apis']['sku']['name'];
    this.apiServer.apis.shiftAPI.interval = parseInt(
      data['apis']['sku']['interval']
    );

    this.apiServer.apis.eventsAPI.name =
      this.apiServer.pi + data['apis']['events']['name'];
    this.apiServer.apis.eventsAPI.interval = parseInt(
      data['apis']['events']['interval']
    );

    this.apiServer.apis.alarmsAPI.name =
      this.apiServer.pi + data['apis']['alarms']['name'];
    this.apiServer.apis.alarmsAPI.interval = parseInt(
      data['apis']['alarms']['interval']
    );

    this.apiServer.apis.connectionAPI.name =
      this.apiServer.pi + data['apis']['connection']['name'];
    this.apiServer.apis.connectionAPI.interval = parseInt(
      data['apis']['connection']['interval']
    );

    // this.apiServer.apis.bmpAPI.name = this.apiServer.pi + data['apis']['bmp']['name'];
    // this.apiServer.apis.bmpAPI.serverAPI = data['apis']['bmp']['serverAPI'];
    // this.apiServer.apis.bmpAPI.interval = parseInt(data['apis']['bmp']['interval']);

    this.viewLogs = data['display_logs'];
    this.machines = data['machines'];

    console.log(this.machines);

    this.allLinemachines = data['machines'];
    this.headerInfo.shiftTimings = data['shift_timings'];

    this.getConnections();
    this.httpClient
      .get(this.apiServer.apis.shiftAPI.name)
      .subscribe((res: any[]) => {
        var filtermachines = [];
        for (let i = 0; i < Object.keys(res).length; i++) {
          filtermachines.push(res[i]['machine']);
        }
        this.filteredObject = {};
        for (let e in this.machines) {
          if (this.machines.hasOwnProperty(e)) {
            if (filtermachines.indexOf(e) != -1) {
              this.filteredObject[e] = this.machines[e];
            }
          }
        }
        this.machines = this.filteredObject;
        //this.allLinkedmachines = res.map(item => item.machine).filter((value, index, self) => self.indexOf(value) === index);

        //this.machines = Object.keys(this.machines).filter(key => !filtermachines.includes(key)).forEach(key => delete this.machines[key]);
        //this.machines = Object.keys(this.machines).filter(key => filtermachines.includes(key)).reduce((obj, key) => { obj[key] = this.machines[key]; return obj; }, {});

        var data: any[] = res;
        this.apiData.shiftData = {};
        for (let i = 0; i < data.length; i++)
          this.apiData.shiftData[data[i]['machine']] = data[i];
        this.headerInfo.currentShift = this.apiData.shiftData[
          this.criticalMachine
        ]['shift'];
        this.headerInfo.currentTime = this.manualentryservice.ConvertToLocalTimezone(
          new Date(
            this.apiData.shiftData[this.criticalMachine]['current_timeStamp']
          )
        );
        this.headerInfo.currentOperator =
          this.apiData.shiftData[this.criticalMachine]['operator_name'] ===
            undefined || null
            ? ''
            : this.apiData.shiftData[this.criticalMachine]['operator_name']
                .operator_name;
        // this.observers.headerInformationAsObserver.next(this.headerInfo);

        this.httpClient
          .get(this.apiServer.apis.skuAPI.name)
          .subscribe((res: any[]) => {
            this.machines = this.filteredObject;
            var data: any[] = res;
            this.apiData.skuData = {};
            for (let i = 0; i < data.length; i++)
              this.apiData.skuData[data[i]['machine']] = data[i];
            this.getParameterWiseMachinesData(this.apiData.skuData);
            this.getParameterWiseMachinesData(this.apiData.shiftData);

            var fromDateShift;
            var toDateShift;
            fromDateShift =
              this.datePipe.transform(
                this.headerInfo.currentTime,
                'yyyy-MM-dd'
              ) +
              'T' +
              this.headerInfo.shiftTimings[this.headerInfo.currentShift].from;
            toDateShift =
              this.datePipe.transform(
                this.headerInfo.currentTime,
                'yyyy-MM-dd'
              ) +
              'T' +
              this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
            if (new Date(fromDateShift) > new Date(toDateShift)) {
              if (
                new Date(this.headerInfo.currentTime).getHours() <= 24 &&
                new Date(this.headerInfo.currentTime).getHours() >=
                  new Date(fromDateShift).getHours()
              ) {
                toDateShift =
                  this.datePipe.transform(
                    addDays(new Date(toDateShift), 1),
                    'yyyy-MM-dd'
                  ) +
                  'T' +
                  this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
              } else {
                fromDateShift =
                  this.datePipe.transform(
                    addDays(new Date(fromDateShift), -1),
                    'yyyy-MM-dd'
                  ) +
                  'T' +
                  this.headerInfo.shiftTimings[this.headerInfo.currentShift]
                    .from;
                toDateShift =
                  this.datePipe.transform(new Date(toDateShift), 'yyyy-MM-dd') +
                  'T' +
                  this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
              }
            }
            this.vEventChartData = [];
            this.httpClient
              .get(
                this.apiServer.apis.eventsAPI.name +
                  '?startTime=' +
                  fromDateShift +
                  '&endTime=' +
                  toDateShift
              )
              .subscribe((res: any[]) => {
                this.generateChartStartEnd(fromDateShift, toDateShift, res);
                this.generateCharts(res);
              });
            // this.getBMPData();
            this.httpClient
              .get(this.apiServer.apis.alarmsAPI.name)
              .subscribe((res: any[]) => {
                var data: any = res;
                var tempData = {};
                for (let i = 0; i < data.length; i++)
                  tempData[data[i]['machine_name']] = data[i];
                this.apiData.alarmData = data;
                for (let i = 0; i < Object.keys(this.machines).length; i++) {
                  if (tempData[Object.keys(this.machines)[i]] !== undefined) {
                    this.currentFirstFault[Object.keys(this.machines)[i]] =
                      tempData[Object.keys(this.machines)[i]][
                        'current_first_fault'
                      ];
                    this.currentActiveAlarms[Object.keys(this.machines)[i]] =
                      tempData[Object.keys(this.machines)[i]]['alarm'];
                  } else {
                    this.currentFirstFault[Object.keys(this.machines)[i]] = '-';
                    this.currentActiveAlarms[
                      Object.keys(this.machines)[i]
                    ] = [];
                  }
                }
                this.parameterWiseMachinesData[
                  'current_first_fault'
                ] = this.currentFirstFault;
                this.parameterWiseMachinesData[
                  'current_active_alarms'
                ] = this.currentActiveAlarms;
              });
            this.getConnections();
            this.criticalMachineData = [];
            for (
              let i = 0;
              i < Object.keys(this.criticalMachineParameters).length;
              i++
            ) {
              var parameter = Object.keys(this.criticalMachineParameters)[i];
              if (
                this.parameterWiseMachinesData[
                  Object.keys(this.criticalMachineParameters)[i]
                ] === undefined
              ) {
                if (
                  Object.keys(this.criticalMachineParameters)[i].indexOf('/') >
                  -1
                ) {
                  var parameterValues = {};
                  for (
                    let k = 0;
                    k < Object.keys([this.criticalMachine]).length;
                    k++
                  ) {
                    for (
                      let j = 0;
                      j <
                      Object.keys(this.criticalMachineParameters)[i].split('/')
                        .length;
                      j++
                    ) {
                      this.parameterWiseMachinesData[
                        Object.keys(this.criticalMachineParameters)[i]
                      ] = {};
                      if (
                        parameterValues[Object.keys(this.machines)[k]] ===
                        undefined
                      )
                        parameterValues[Object.keys(this.machines)[k]] = '';

                      if (
                        this.parameterWiseMachinesData[
                          Object.keys(this.criticalMachineParameters)[i].split(
                            '/'
                          )[j]
                        ] !== undefined
                      ) {
                        parameterValues[Object.keys(this.machines)[k]] +=
                          this.parameterWiseMachinesData[
                            Object.keys(this.criticalMachineParameters)[
                              i
                            ].split('/')[j]
                          ][Object.keys(this.machines)[k]] +
                          (j ===
                          Object.keys(this.criticalMachineParameters)[i].split(
                            '/'
                          ).length -
                            1
                            ? ''
                            : '/');
                      } //else
                    }
                  }
                  this.criticalMachineData.push({
                    title: parameter,
                    value: parameterValues,
                  });
                } else {
                  console.error(
                    'wrong parameter ' +
                      Object.keys(this.criticalMachineParameters)[i]
                  );
                }
              } else {
                this.criticalMachineData.push({
                  title: parameter,
                  value: this.parameterWiseMachinesData[
                    Object.keys(this.criticalMachineParameters)[i]
                  ][this.criticalMachine],
                });
              }
            }
            this.machines = this.filteredObject;
            this.filterMachineParameters();
          });
      });

    this.apiDataService.shiftDataService = setInterval(() => {
      this.getShiftData();
    }, this.apiServer.apis.shiftAPI.interval * 1000);

    this.httpClient.get('configs/apix/data_pattern.json').subscribe((res) => {
      var data: any = res;
      this.tableParameters = res['table']['parameters'];
      this.statusColors = res['status_color'];

      this.eventChart.Parameters = res['event_chart']['parameters'];
      this.pieChart.Parameters = res['pie_chart']['parameters'];

      this.criticalMachine = res['critical_machine']['name'];
      this.criticalMachineParameters = res['critical_machine']['parameters'];

      this.faultDescritions = res['faultDescritions'];
    });
  }

  getShiftData() {
    this.httpClient
      .get(this.apiServer.apis.shiftAPI.name)
      .subscribe((res: any[]) => {
        this.allLinkedmachines = res
          .map((item) => item.machine)
          .filter((value, index, self) => self.indexOf(value) === index);
        // //Assigning all machines from setting file
        // this.machines = this.allLinemachines;

        // var filtermachines = [];
        // for (let i = 0; i < Object.keys(res).length; i++) {
        //   filtermachines.push(res[i]['machine']);
        // }

        //Filtering machines based on data received from Shift API.
        // this.machines = Object.keys(this.machines).filter(key => filtermachines.includes(key)).reduce((obj, key) => { obj[key] = this.machines[key]; return obj; }, {});
        var filtermachines = [];
        for (let i = 0; i < Object.keys(res).length; i++) {
          filtermachines.push(res[i]['machine']);
        }
        var filteredObject = {};
        for (let e in this.machines) {
          if (this.machines.hasOwnProperty(e)) {
            if (filtermachines.indexOf(e) != -1) {
              filteredObject[e] = this.machines[e];
            }
          }
        }
        this.machines = filteredObject;

        var data: any[] = res;
        this.apiData.shiftData = {};
        for (let i = 0; i < data.length; i++)
          this.apiData.shiftData[data[i]['machine']] = data[i];

        this.headerInfo.currentShift = this.apiData.shiftData[
          this.criticalMachine
        ]['shift'];
        this.headerInfo.currentTime = this.manualentryservice.ConvertToLocalTimezone(
          new Date(
            this.apiData.shiftData[this.criticalMachine]['current_timeStamp']
          )
        );
        // this.observers.headerInformationAsObserver.next(this.headerInfo);

        //this.consoleLog('apiShiftData');
        this.getSKUData();
        this.getParameterWiseMachinesData(this.apiData.shiftData);

        this.httpClient
          .get(this.apiServer.apis.skuAPI.name)
          .subscribe((res: any[]) => {
            var data: any[] = res;
            this.apiData.skuData = {};
            for (let i = 0; i < data.length; i++)
              this.apiData.skuData[data[i]['machine']] = data[i];
            this.getParameterWiseMachinesData(this.apiData.skuData);
            this.filterMachineParameters();
          });

        var fromDateShift; //= (new Date(this.headerInfo.currentTime).getFullYear()) + '-' + ((new Date(this.headerInfo.currentTime).getMonth() + 1) < 10 ? '0' + (new Date(this.headerInfo.currentTime).getMonth() + 1) : (new Date(this.headerInfo.currentTime).getMonth() + 1)) + '-' + ((new Date(this.headerInfo.currentTime).getDate()) < 10 ? '0' + (new Date(this.headerInfo.currentTime).getDate()) : (new Date(this.headerInfo.currentTime).getDate())) + 'T' + this.headerInfo.shiftTimings[this.headerInfo.currentShift].from + ':00';
        var toDateShift;

        fromDateShift =
          this.datePipe.transform(this.headerInfo.currentTime, 'yyyy-MM-dd') +
          'T' +
          this.headerInfo.shiftTimings[this.headerInfo.currentShift].from;
        toDateShift =
          this.datePipe.transform(this.headerInfo.currentTime, 'yyyy-MM-dd') +
          'T' +
          this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
        //For a shift time falling to new day we are adding 1 day.
        if (new Date(fromDateShift) > new Date(toDateShift)) {
          if (
            new Date(this.headerInfo.currentTime).getHours() <= 24 &&
            new Date(this.headerInfo.currentTime).getHours() >=
              new Date(fromDateShift).getHours()
          ) {
            toDateShift =
              this.datePipe.transform(
                addDays(new Date(toDateShift), 1),
                'yyyy-MM-dd'
              ) +
              'T' +
              this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
          } else {
            fromDateShift =
              this.datePipe.transform(
                addDays(new Date(fromDateShift), -1),
                'yyyy-MM-dd'
              ) +
              'T' +
              this.headerInfo.shiftTimings[this.headerInfo.currentShift].from;
            toDateShift =
              this.datePipe.transform(new Date(toDateShift), 'yyyy-MM-dd') +
              'T' +
              this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
          }
        }
        this.vEventChartData = [];

        this.httpClient
          .get(
            this.apiServer.apis.eventsAPI.name +
              '?startTime=' +
              fromDateShift +
              '&endTime=' +
              toDateShift
          )
          .subscribe((res: any[]) => {
            this.generateChartStartEnd(fromDateShift, toDateShift, res);
            this.generateCharts(res);
          });

        this.getActiveAlarmsData();
        this.criticalMachineData = [];

        for (
          let i = 0;
          i < Object.keys(this.criticalMachineParameters).length;
          i++
        ) {
          var parameter = Object.keys(this.criticalMachineParameters)[i];

          if (
            this.parameterWiseMachinesData[
              Object.keys(this.criticalMachineParameters)[i]
            ] === undefined
          ) {
            if (
              Object.keys(this.criticalMachineParameters)[i].indexOf('/') > -1
            ) {
              var parameterValues = {};
              for (
                let k = 0;
                k < Object.keys([this.criticalMachine]).length;
                k++
              ) {
                for (
                  let j = 0;
                  j <
                  Object.keys(this.criticalMachineParameters)[i].split('/')
                    .length;
                  j++
                ) {
                  this.parameterWiseMachinesData[
                    Object.keys(this.criticalMachineParameters)[i]
                  ] = {};
                  if (
                    parameterValues[Object.keys(this.machines)[k]] === undefined
                  )
                    parameterValues[Object.keys(this.machines)[k]] = '';

                  if (
                    this.parameterWiseMachinesData[
                      Object.keys(this.criticalMachineParameters)[i].split('/')[
                        j
                      ]
                    ] !== undefined
                  )
                    parameterValues[Object.keys(this.machines)[k]] +=
                      this.parameterWiseMachinesData[
                        Object.keys(this.criticalMachineParameters)[i].split(
                          '/'
                        )[j]
                      ][Object.keys(this.machines)[k]] +
                      (j ===
                      Object.keys(this.criticalMachineParameters)[i].split('/')
                        .length -
                        1
                        ? ''
                        : '/');
                }
              }
              this.criticalMachineData.push({
                title: parameter,
                value: parameterValues,
              });
            } else {
              console.error(
                'wrong parameter ' +
                  Object.keys(this.criticalMachineParameters)[i]
              );
            }
          } else {
            this.criticalMachineData.push({
              title: parameter,
              value: this.parameterWiseMachinesData[
                Object.keys(this.criticalMachineParameters)[i]
              ][this.criticalMachine],
            });
          }
        }
        this.filterMachineParameters();
      });
  }

  getSKUData() {
    this.apiDataService.skuDataService = setInterval(() => {
      this.httpClient
        .get(this.apiServer.apis.skuAPI.name)
        .subscribe((res: any[]) => {
          var data: any[] = res;
          this.apiData.skuData = {};
          for (let i = 0; i < data.length; i++)
            this.apiData.skuData[data[i]['machine']] = data[i];
          this.getParameterWiseMachinesData(this.apiData.skuData);
          this.filterMachineParameters();
        });
    }, this.apiServer.apis.skuAPI.interval * 1000);
  }

  getEventAndPieData() {
    var fromDateShift;
    var toDateShift;

    fromDateShift =
      this.datePipe.transform(this.headerInfo.currentTime, 'yyyy-MM-dd') +
      'T' +
      this.headerInfo.shiftTimings[this.headerInfo.currentShift].from;
    toDateShift =
      this.datePipe.transform(this.headerInfo.currentTime, 'yyyy-MM-dd') +
      'T' +
      this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
    //For a shift time falling to new day we are adding 1 day.
    if (new Date(fromDateShift) > new Date(toDateShift)) {
      if (
        new Date(this.headerInfo.currentTime).getHours() <= 24 &&
        new Date(this.headerInfo.currentTime).getHours() >=
          new Date(fromDateShift).getHours()
      ) {
        toDateShift =
          this.datePipe.transform(
            addDays(new Date(toDateShift), 1),
            'yyyy-MM-dd'
          ) +
          'T' +
          this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
      } else {
        fromDateShift =
          this.datePipe.transform(
            addDays(new Date(fromDateShift), -1),
            'yyyy-MM-dd'
          ) +
          'T' +
          this.headerInfo.shiftTimings[this.headerInfo.currentShift].from;
        toDateShift =
          this.datePipe.transform(new Date(toDateShift), 'yyyy-MM-dd') +
          'T' +
          this.headerInfo.shiftTimings[this.headerInfo.currentShift].to;
      }
    }

    this.apiDataService.eventDataService = setInterval(() => {
      this.vEventChartData = [];

      this.httpClient
        .get(
          this.apiServer.apis.eventsAPI.name +
            '?startTime=' +
            fromDateShift +
            '&endTime=' +
            toDateShift
        )
        .subscribe((res: any[]) => {
          this.generateChartStartEnd(fromDateShift, toDateShift, res);
          this.generateCharts(res);
        });
    }, this.apiServer.apis.eventsAPI.interval * 1000);
  }

  filterMachineParameters() {
    for (let i = 0; i < Object.keys(this.tableParameters).length; i++) {
      var parameter = Object.keys(this.tableParameters)[i];
      if (
        this.parameterWiseMachinesData[Object.keys(this.tableParameters)[i]] !==
        undefined
      ) {
        this.parameterWiseMachinesData[Object.keys(this.tableParameters)[i]][
          'parameter_name'
        ] = parameter;
        this.parameterWiseMachinesTableData[
          parameter
        ] = this.parameterWiseMachinesData[
          Object.keys(this.tableParameters)[i]
        ];
      }

      if (Object.keys(this.tableParameters)[i].indexOf('/') > -1) {
        var parameterValues = {};
        var percentageValues = {};
        for (let k = 0; k < Object.keys(this.machines).length; k++) {
          for (
            let j = 0;
            j < Object.keys(this.tableParameters)[i].split('/').length;
            j++
          ) {
            this.parameterWiseMachinesData[
              Object.keys(this.tableParameters)[i]
            ] = {};
            if (parameterValues[Object.keys(this.machines)[k]] === undefined)
              parameterValues[Object.keys(this.machines)[k]] = '';

            if (
              this.parameterWiseMachinesData[
                Object.keys(this.tableParameters)[i].split('/')[j]
              ] !== undefined
            ) {
              parameterValues[Object.keys(this.machines)[k]] +=
                this.parameterWiseMachinesData[
                  Object.keys(this.tableParameters)[i].split('/')[j]
                ][Object.keys(this.machines)[k]] +
                (j ===
                Object.keys(this.tableParameters)[i].split('/').length - 1
                  ? ''
                  : '/');
            }
            // else

            if (
              Object.keys(this.tableParameters)[i].split('/')[j].indexOf('%') >
              -1
            ) {
              if (percentageValues[Object.keys(this.machines)[k]] === undefined)
                percentageValues[Object.keys(this.machines)[k]] = '';
              percentageValues[Object.keys(this.machines)[k]] = '';
              parameterValues[Object.keys(this.machines)[k]] +=
                parseFloat(
                  (
                    (this.parameterWiseMachinesData[
                      Object.keys(this.tableParameters)
                        [i].split('/')
                        [j].split('%')[0]
                    ][Object.keys(this.machines)[k]] *
                      100) /
                    this.parameterWiseMachinesData[
                      Object.keys(this.tableParameters)
                        [i].split('/')
                        [j].split('%')[1]
                    ][Object.keys(this.machines)[k]]
                  ).toString()
                ).toFixed(2) + '%';
            }
          }
        }

        this.parameterWiseMachinesData[parameter] = parameterValues;
        this.parameterWiseMachinesTableData[parameter] = parameterValues;
      } else if (Object.keys(this.tableParameters)[i].indexOf('%') > -1) {
      } else {
      }
    }
  }

  generateChartStartEnd(fromDateShift, toDateShift, machinedata) {
    //Filtering  all those machines which are send by backend.
    this.allLinkedmachines = machinedata
      .map((item) => item.machine_name)
      .filter((value, index, self) => self.indexOf(value) === index);

    //Arranging/Overwriting machines series.
    this.allLinkedmachines = Object.keys(this.machines).filter((m) =>
      this.allLinkedmachines.includes(m)
    );

    for (let i = 0; i < this.allLinkedmachines.length; i++) {
      var setStart = [
        this.machines[this.allLinkedmachines[i]]['display_name'], //Object.keys(this.machines)[i],
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
        this.machines[this.allLinkedmachines[i]]['display_name'], //Object.keys(this.machines)[i],
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

  generateCharts(data: any[]) {
    this.eventDataByMachines = {};
    for (let i = 0; i < data.length; i++) {
      var stopName = data[i]['stop_name'];
      if (
        data[i]['stop_name'].includes('stop') &&
        !data[i]['stop_name'].includes('manual_stop')
      )
        stopName = 'stop';

      if (this.eventDataByMachines[data[i]['machine_name']] === undefined)
        this.eventDataByMachines[data[i]['machine_name']] = {};
      if (
        this.eventDataByMachines[data[i]['machine_name']][stopName] ===
        undefined
      )
        this.eventDataByMachines[data[i]['machine_name']][stopName] = {};
      if (
        this.eventDataByMachines[data[i]['machine_name']][stopName]['data'] ===
        undefined
      )
        this.eventDataByMachines[data[i]['machine_name']][stopName][
          'data'
        ] = [];
      if (
        this.eventDataByMachines[data[i]['machine_name']][stopName]['count'] ===
        undefined
      )
        this.eventDataByMachines[data[i]['machine_name']][stopName][
          'count'
        ] = 0;
      if (
        this.eventDataByMachines[data[i]['machine_name']][stopName][
          'duration'
        ] === undefined
      )
        this.eventDataByMachines[data[i]['machine_name']][stopName][
          'duration'
        ] = 0;

      this.eventDataByMachines[data[i]['machine_name']][stopName]['data'].push(
        data[i]
      );
      this.eventDataByMachines[data[i]['machine_name']][stopName][
        'fault_name'
      ] = stopName;
      this.eventDataByMachines[data[i]['machine_name']][stopName]['count'] += 1;
      this.eventDataByMachines[data[i]['machine_name']][stopName][
        'duration'
      ] += Math.round(
        (new Date(data[i]['end_time']).getTime() -
          new Date(data[i]['start_time']).getTime()) /
          1000
      );

      if (
        Object.keys(this.eventChart.Parameters).indexOf(data[i]['stop_name']) >
          -1 ||
        (data[i]['stop_name'].indexOf('stop') > -1 &&
          data[i]['stop_name'].indexOf('manual_stop') === -1)
      ) {
        if (data[i]['stop_name'].indexOf('stop_') > -1) {
          var event = [
            this.machines[data[i]['machine_name']]['display_name'],
            // data[i]['machine_name']+'_'+data[i]['stop_name']+'_'+data[i]['_id'],
            // this.faultDescritions[data[i]['machine_name']][data[i]['stop_name'].replace('stop','fault')].short,

            this.faultDescritions[data[i]['machine_name']][
              data[i]['stop_name'].replace('stop', 'fault')
            ] === undefined
              ? ''
              : this.faultDescritions[data[i]['machine_name']][
                  data[i]['stop_name'].replace('stop', 'fault')
                ].short +
                '/' +
                data[i]['_id'] +
                '/' +
                data[i]['stop_name'] +
                '/' +
                data[i]['machine_name'],
            this.statusColors['stop']['color'],
            new Date(
              this.manualentryservice.ConvertToLocalTimezone(
                new Date(data[i]['start_time'])
              )
            ),
            new Date(
              this.manualentryservice.ConvertToLocalTimezone(
                new Date(data[i]['end_time'])
              )
            ),
            data[i]['video_url'] !== undefined ? data[i]['video_url'] : '',
          ];
          this.vEventChartData.push(event);
        } else if (
          data[i]['stop_name'].indexOf('fault_') === -1 &&
          !(
            data[i]['machine_name'] !== this.criticalMachine &&
            data[i]['stop_name'] === 'ready'
          )
        ) {
          var event = [
            this.machines[data[i]['machine_name']]['display_name'], //data[i]['machine_name'],
            // data[i]['machine_name']+'_'+data[i]['stop_name']+'_'+data[i]['_id'],
            data[i]['_id'] +
              '/' +
              data[i]['stop_name'] +
              '/' +
              data[i]['machine_name'],
            this.statusColors[data[i]['stop_name']]['color'],
            new Date(
              this.manualentryservice.ConvertToLocalTimezone(
                new Date(data[i]['start_time'])
              )
            ),
            new Date(
              this.manualentryservice.ConvertToLocalTimezone(
                new Date(data[i]['end_time'])
              )
            ),
            data[i]['video_url'] !== undefined ? data[i]['video_url'] : '',
          ];
          this.vEventChartData.push(event);
        }
      }
    }

    var machineWisePlotingData = {};
    this.machineWiseFaults = {};

    this.parameterWiseMachinesData['manual_stop'] = {};
    var machineWiseManualStops = {};

    this.allLinkedmachines = data
      .map((item) => item.machine_name)
      .filter((value, index, self) => self.indexOf(value) === index);

    //this.allLinkedmachines = Object.keys(this.machines).filter((m) => this.allLinkedmachines.includes(m));
    //this.machines = Object.keys(this.machines).filter(key => this.allLinkedmachines.includes(key)).reduce((obj, key) => { obj[key] = this.machines[key]; return obj; }, {});

    for (let i = 0; i < Object.keys(this.machines).length; i++) {
      this.machineWiseFaults[Object.keys(this.machines)[i]] = [];

      if (machineWisePlotingData[Object.keys(this.machines)[i]] === undefined)
        machineWisePlotingData[Object.keys(this.machines)[i]] = [];

      this.pieCharts[Object.keys(this.machines)[i]] = {};
      var machineData = this.eventDataByMachines[Object.keys(this.machines)[i]];

      if (machineData === undefined)
        machineWisePlotingData[Object.keys(this.machines)[i]].push(['pdt', 12]);
      else {
        Object.keys(
          this.eventDataByMachines[Object.keys(this.machines)[i]]
        ).filter((s) => {
          // this.parameterWiseMachinesData['manual_stop'][Object.keys(this.machines)[i]] = '-'
          s.includes('fault_')
            ? this.machineWiseFaults[Object.keys(this.machines)[i]].push(
                this.eventDataByMachines[Object.keys(this.machines)[i]][s]
              )
            : '';
          if (s.includes('manual_stop')) {
            if (this.machineWiseFaultsTableData['manual_stops'] === undefined)
              this.machineWiseFaultsTableData['manual_stops'] = {
                count: {},
                duration: {},
              };

            this.machineWiseFaultsTableData['manual_stops']['count'][
              Object.keys(this.machines)[i]
            ] = this.eventDataByMachines[Object.keys(this.machines)[i]][s][
              'count'
            ];
            this.machineWiseFaultsTableData['manual_stops']['duration'][
              Object.keys(this.machines)[i]
            ] = this.eventDataByMachines[Object.keys(this.machines)[i]][s][
              'duration'
            ];

            machineWiseManualStops[
              Object.keys(this.machines)[i]
            ] = this.eventDataByMachines[Object.keys(this.machines)[i]][s];
            this.parameterWiseMachinesData['manual_stop'][
              Object.keys(this.machines)[i]
            ] = machineWiseManualStops[Object.keys(this.machines)[i]]['count'];
          }
        });

        for (let j = 0; j < Object.keys(this.pieChart.Parameters).length; j++)
          if (
            Object.keys(machineData).indexOf(
              Object.keys(this.pieChart.Parameters)[j]
            ) > -1
          )
            machineWisePlotingData[Object.keys(this.machines)[i]].push([
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
            machineWisePlotingData[Object.keys(this.machines)[i]].push([
              Object.keys(this.pieChart.Parameters)[j],
              0,
            ]);
      }
      this.pieCharts[Object.keys(this.machines)[i]]['plotingData'] =
        machineWisePlotingData[Object.keys(this.machines)[i]];
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

    // for(let j=0;j<Object.keys(this.machineWiseFaults).length; j++){
    //   machineWiseSortedKeys.duration[Object.keys(this.machineWiseFaults)[j]] = this.machineWiseFaults[Object.keys(this.machineWiseFaults)[j]].sort((a,b) => { return b.duration - a.duration });
    // }

    var topFirstFaults = {
      count: {},
      duration: {},
    };
    for (let i = 0; i < Object.keys(this.machines).length; i++) {
      for (
        let j = 0;
        j <
        machineWiseSortedKeys['count'][Object.keys(this.machines)[i]].length;
        j++
      ) {
        if (topFirstFaults['count']['top_first_fault_' + (j + 1)] === undefined)
          topFirstFaults['count']['top_first_fault_' + (j + 1)] = {};
        // if(topFirstFaults['duration']['top_first_fault_'+(j+1)]===undefined) topFirstFaults['duration']['top_first_fault_'+(j+1)] = {};
        topFirstFaults['count']['top_first_fault_' + (j + 1)][
          Object.keys(this.machines)[i]
        ] = machineWiseSortedKeys['count'][Object.keys(this.machines)[i]][j];
        // topFirstFaults['duration']['top_first_fault_'+(j+1)][Object.keys(this.machines)[i]] = machineWiseSortedKeys['duration'][Object.keys(this.machines)[i]][j];
      }

      for (
        let j =
          machineWiseSortedKeys['count'][Object.keys(this.machines)[i]].length;
        j < 5;
        j++
      ) {
        if (topFirstFaults['count']['top_first_fault_' + (j + 1)] === undefined)
          topFirstFaults['count']['top_first_fault_' + (j + 1)] = {};
        // if(topFirstFaults['duration']['top_first_fault_'+(j+1)]===undefined) topFirstFaults['duration']['top_first_fault_'+(j+1)] = {};
        topFirstFaults['count']['top_first_fault_' + (j + 1)][
          Object.keys(this.machines)[i]
        ] = {};
        // topFirstFaults['duration']['top_first_fault_'+(j+1)][Object.keys(this.machines)[i]] = {};
      }

      for (let j = 0; j < Object.keys(topFirstFaults.count).length; j++) {
        this.parameterWiseMachinesData[Object.keys(topFirstFaults.count)[j]] =
          topFirstFaults.count[Object.keys(topFirstFaults.count)[j]];
      }
    }

    // this.machineWiseFaultsTableData['manual_stops'] = machineWiseManualStops;
    this.machineWiseFaultsTableData['faults'] = topFirstFaults;

    this.filterMachineParameters();
    this.observers.pieChartsDataAsObserver.next(this.pieCharts);
    this.observers.eventChartDataAsObserver.next(this.vEventChartData);
  }

  getActiveAlarmsData() {
    this.apiDataService.alarmDataService = setInterval(() => {
      this.httpClient
        .get(this.apiServer.apis.alarmsAPI.name)
        .subscribe((res: any[]) => {
          var data: any = res;
          var tempData = {};

          for (let i = 0; i < data.length; i++)
            tempData[data[i]['machine_name']] = data[i];
          this.apiData.alarmData = data;
          for (let i = 0; i < Object.keys(this.machines).length; i++) {
            if (tempData[Object.keys(this.machines)[i]] !== undefined) {
              this.currentFirstFault[Object.keys(this.machines)[i]] =
                tempData[Object.keys(this.machines)[i]]['current_first_fault'];
              this.currentActiveAlarms[Object.keys(this.machines)[i]] =
                tempData[Object.keys(this.machines)[i]]['alarm'];
            } else {
              this.currentFirstFault[Object.keys(this.machines)[i]] = '-';
              this.currentActiveAlarms[Object.keys(this.machines)[i]] = [];
            }
          }
          this.parameterWiseMachinesData[
            'current_first_fault'
          ] = this.currentFirstFault;
          this.parameterWiseMachinesData[
            'current_active_alarms'
          ] = this.currentActiveAlarms;
        });
    }, this.apiServer.apis.alarmsAPI.interval * 1000);
  }

  getConnections() {
    this.apiDataService.connectionStatusService = setInterval(() => {
      this.httpClient.get(this.apiServer.apis.connectionAPI.name).subscribe(
        (res: any[]) => {
          var data: any = res;
        },
        (error) => {
          var data = {
            current_timestamp: '2019-09-30T18:32:52+05:30',
            machine_name: 'filler',
            status: 'con_error',
          };
        }
      );
    }, this.apiServer.apis.connectionAPI.interval * 1000);
  }


  getEventChartData(): Observable<any> {
    return new Observable<any>((observer) => {
      this.observers.eventChartDataAsObserver = observer;
    });
  }

  getPieChartData(): Observable<any> {
    // setInterval(() => this.pieChartData.next(Math.random() * 50), 1000);
    return new Observable<any>((observer) => {
      this.observers.pieChartsDataAsObserver = observer;
    });
  }

  getParameterWiseMachinesData(data) {
    for (let i = 0; i < Object.keys(data[this.criticalMachine]).length; i++) {
      var parameter = Object.keys(data[this.criticalMachine])[i];
      for (let j = 0; j < Object.keys(this.machines).length; j++) {
        if (this.parameterWiseMachinesData[parameter] === undefined)
          this.parameterWiseMachinesData[parameter] = {};

        if (
          data[Object.keys(this.machines)[j]] !== undefined &&
          data[Object.keys(this.machines)[j]][parameter] !== undefined
        )
          this.parameterWiseMachinesData[parameter][
            Object.keys(this.machines)[j]
          ] = data[Object.keys(this.machines)[j]][parameter];
        else
          this.parameterWiseMachinesData[parameter][
            Object.keys(this.machines)[j]
          ] = '-';
      }
    }
    return this.parameterWiseMachinesData;
  }
  consoleLog(v, d?: string) {
    if (this.viewLogs) {
      if (d !== null && d !== undefined) {
        //console.log(d);
      }
    }
  }

  ngOnDestroy() {
    if (this.apiDataService.shiftDataService) {
      clearInterval(this.apiDataService.shiftDataService);
    }
    if (this.apiDataService.skuDataService) {
      clearInterval(this.apiDataService.skuDataService);
    }
    if (this.apiDataService.eventDataService) {
      clearInterval(this.apiDataService.eventDataService);
    }

    if (this.apiDataService.alarmDataService) {
      clearInterval(this.apiDataService.alarmDataService);
    }
    //if (this.apiDataService.bmpDataService) {
    //clearInterval(this.apiDataService.bmpDataService);
    //}
    if (this.apiDataService.connectionStatusService) {
      clearInterval(this.apiDataService.connectionStatusService);
    }
  }
  async getAPIPath() {
    let data = await this.httpClient
      .get('configs/apix/api_server.json')
      .toPromise();
    return data;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SocketappDataService {
  observer: Observer<number>;

  constructor(private socket: Socket) {}

  getQuotes(): Observable<number> {
    this.socket.on('data', (res) => {
      this.observer.next(res.data);
    });

    return this.createObservable();
  }

  createObservable(): Observable<number> {
    return new Observable<number>((observer) => {
      this.observer = observer;
    });
  }

  private handleError(error) {
    console.error('server error: ', error);
    if (error.error instanceof Error) {
      let errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }

  addMyDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
