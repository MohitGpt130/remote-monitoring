import { EventsAnalysisService } from './../events-analysis.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lineID;
  lineConfigs;

  tableConfig;
  tableData;
  conversion;
  tableDataLoaded = false;

  eventsTimelineConfig;
  eventsData;

  gridConfig;
  shiftData;
  shiftDataLoaded = false;

  faultsTableSettings;
  faultsData;
  faultsDataLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private eventsAnalysisService: EventsAnalysisService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const line = params.get('lineID');
      this.lineID = line;
      if (line) {
        console.log(params.get('lineID'));
        this.eventsAnalysisService
          .getLineConfig(params.get('lineID'))
          .subscribe((lineConfigs) => {
            console.log(lineConfigs);
            this.lineConfigs = lineConfigs;
            this.httpClient
              .get(lineConfigs.analysedSummaryDataAPI.config)
              .subscribe((tableConfig) => {
                this.tableConfig = tableConfig;

                if (lineConfigs.analysedSummaryDataAPI.interval) {
                  this.getAnalysedTableData(
                    lineConfigs.analysedSummaryDataAPI.data
                  );
                  setInterval(() => {
                    this.getAnalysedTableData(
                      lineConfigs.analysedSummaryDataAPI.data
                    );
                  }, lineConfigs.analysedSummaryDataAPI.interval * 1000);
                } else {
                  this.getAnalysedTableData(
                    lineConfigs.analysedSummaryDataAPI.data
                  );
                }
              });

            this.httpClient
              .get(lineConfigs.shiftDataAPI.config)
              .subscribe((shiftDataConfig: any) => {
                this.gridConfig = shiftDataConfig;

                if (lineConfigs.shiftDataAPI.interval) {
                  this.getShiftData(lineConfigs.shiftDataAPI.data);
                  setInterval(() => {
                    this.getShiftData(lineConfigs.shiftDataAPI.data);
                  }, lineConfigs.shiftDataAPI.interval * 1000);
                } else {
                  this.getShiftData(lineConfigs.shiftDataAPI.data);
                }
              });

            this.httpClient
              .get(lineConfigs.faultsDataTable.config)
              .subscribe((faultsTableSettings: any) => {
                this.faultsTableSettings = faultsTableSettings;

                if (lineConfigs.faultsDataTable.interval) {
                  this.getFaultsData(lineConfigs.faultsDataTable.data);
                  setInterval(() => {
                    this.getFaultsData(lineConfigs.faultsDataTable.data);
                  }, lineConfigs.faultsDataTable.interval * 1000);
                } else {
                  this.getFaultsData(lineConfigs.faultsDataTable.data);
                }
              });
          });
      }
    });

    // this.getAnalysedTableData();

    // this.httpClient.get('configs/default-line/data-table.config.json').subscribe(tableConfig => {
    //   this.tableConfig = tableConfig;

    //   this.httpClient.get('configs/sample-data/data-table.json').subscribe((tableData) => {
    //     this.tableData = tableData;
    //     this.tableDataLoaded = true;
    //   });
    // });

    // this.httpClient.get('configs/default-line/events-timeline.config.json').subscribe(eventsTimelineConfig => {
    //   this.eventsTimelineConfig = eventsTimelineConfig;
    //   this.httpClient.get('https://int91mat.smartfactoryworx.tech/api/shift/shift/all?line_id=5f0809fdc2b1ce30cc53eb8d').subscribe((eventsData) => { //configs/sample-data/events-data.json //
    //     this.eventsData = eventsData;
    //     this.dataLoaded = true;
    //   });
    // });
  }

  getAnalysedTableData(api): void {
    console.log(api);

    this.httpClient.get(api).subscribe((tableData) => {
      console.log(tableData);

      this.tableData = tableData;
      this.conversion = 'machines2parameter';
      this.tableDataLoaded = true;

      // this.httpClient
      //   .get(
      //     'https://dashboard.testing.smartfactoryworx.net/api/alarm?line_id=5f0809fdc2b1ce30cc53eb8d'
      //   )
      //   .subscribe((activeAlarms) => {
      //     Object.keys(activeAlarms[0]).forEach(key => {
      //       this.tableData[0][key] = activeAlarms[0][key];
      //     });
      //     this.tableDataLoaded = true;
      //   });

      // this.httpClient
      //   .get(
      //     'https://dashboard.testing.smartfactoryworx.net/api/shift/shift/all?line_id=5f0809fdc2b1ce30cc53eb8d'
      //   )
      //   .subscribe((shiftData) => {
      //     Object.keys(shiftData[0]).forEach(key => {
      //       this.tableData[0][key] = shiftData[0][key];
      //     });
      //     this.tableDataLoaded = true;
      //   });
    });
  }

  getShiftData(api): void {
    console.log(api);

    this.httpClient.get(api).subscribe((shiftData) => {
      console.log(shiftData);

      this.shiftData = shiftData[0];
      this.shiftDataLoaded = true;

      // this.httpClient
      //   .get(
      //     'https://dashboard.testing.smartfactoryworx.net/api/sku?line_id=5f0809fdc2b1ce30cc53eb8d'
      //   )
      //   .subscribe((tableData) => {
      //     Object.keys(tableData[0]).forEach(key => {
      //       shiftData[0][key] = tableData[0][key];
      //     });
      //     this.shiftData = shiftData[0];
      //     this.shiftDataLoaded = true;
      //   });
    });
  }

  getFaultsData(api?): void {
    if(!api) {
      api = this.lineConfigs.faultsDataTable.data;
    }
    console.log(api);

    this.httpClient.get(api).subscribe((faultsData) => {
      console.log(faultsData);

      this.faultsData = faultsData;
      this.faultsDataLoaded = true;

    });
  }
}
