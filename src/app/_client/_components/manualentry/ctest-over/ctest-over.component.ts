import { WebDataRocksPivot } from './../../webdatarocks/webdatarocks.angular4';
import { Component } from '@angular/core';
import { ViewChild } from '@angular/core'
//import { WebDataRocksPivot
import { HttpClient } from '@angular/common/http';
//import { GoogleCharts } from 'google-charts';

@Component({
  selector: 'app-ctest-over',
  templateUrl: './ctest-over.component.html',
  styleUrls: ['./ctest-over.component.scss']
})
export class CtestOverComponent {

  @ViewChild('pivot1',{static:false  }) child: WebDataRocksPivot;

  public temp = [];

  onPivotReady(pivot: WebDataRocks.Pivot): void {
    console.log("[ready] WebDataRocksPivot", this.child);
  }

  customizeCellFunction(cell, data) {
    if (data.type == "value") {
      if (data.rowIndex % 2 == 0) {
        cell.addClass("alter1");
      } else {
        cell.addClass("alter2");
      }
    }
  }

  onReportComplete() {
    this.GetDatafromAPI();
    //GoogleCharts.load(this.drawChart());
  }
  constructor(private httpClient: HttpClient) {
    console.log('1');
    this.GetDatafromAPI();
  }
  GetDatafromAPI() {

    this.httpClient.get('https://testing.smartfactoryworx.net/dashboard/lines/5ecc8663c4100a70cc4a8d08/monthly-report?from=2020-06-02&to=2020-06-10').subscribe((d: any) => {
      console.log(d.data);
      this.temp = d;
      this.child.webDataRocks.off("reportcomplete");
      this.child.webDataRocks.setReport(
        {
          dataSource: {
            data: this.temp
          },
          slice: {
            rows: [
              {
                uniqueName: "Machine"
              },
              {
                uniqueName: "Date"
              },
              {
                uniqueName: "Operator Name"
              }
            ],
            columns: [
              {
                uniqueName: "Shift"
              }
            ],
            measures: [
              {
                uniqueName: "Efficiency",
                formula: '(("Operating Time"/3600)/("Total Time"/3600))*100',
                aggregation: "average",
                format: "decimal2",
                caption: "Efficiency",
              },
              {
                uniqueName: "Operating Time",
                formula: '"Operating Time"/ 3600',
                format: "decimal2",

                caption: "Operating Time(in Hrs.)",
              },
              {
                uniqueName: "Total Time",
                formula: '"Total Time"/ 3600',
                //aggregation: "average",
                caption: "Total Time(in Hrs.)",
                format: "decimal2"
              }
            ]

          },
          formats: [
            {
              name: "decimal2",
              decimalPlaces: 2
            },
            {
              name: "cellcoloring",
              decimalPlaces: 2
            }
          ],
          conditions: [{
            formula: "#value > 50",
            measure: "Efficiency",
            format: {
              backgroundColor: "#66a3ff",
              color: "white",
              fontFamily: "Arial",
              fontSize: "12px"
            }
          },
          // {
          //   formula: "#value < 10",
          //   format: {
          //     backgroundColor: "#ff9980",
          //     color: "#000000",
          //     fontFamily: "Arial",
          //     fontSize: "12px"
          //   }
          // }
        ],
        }
      );
      //return this.temp;
    });
  }

  drawChart() {

    // Standard google charts functionality is available as GoogleCharts.api after load
    // const data = GoogleCharts.api.visualization.arrayToDataTable([
    //     ['Chart thing', 'Chart amount'],
    //     ['Lorem ipsum', 60],
    //     ['Dolor sit', 22],
    //     ['Sit amet', 18]
    // ]);
    // const pie_1_chart = new GoogleCharts.api.visualization.PieChart(document.getElementById('chart1'));
    // pie_1_chart.draw(data);
}


}
