import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operator-chart-compare',
  templateUrl: './operator-chart-compare.component.html',
  styleUrls: ['./operator-chart-compare.component.scss']
})
export class OperatorChartCompareComponent implements OnInit {
  //---------------------Changeover---------------------------------------
  // multiCO: any[];
  // viewCO: any[] = [400, 250];
  // // options
  // showXAxisCO: boolean = true;
  // showYAxisCO: boolean = true;
  // gradientCO: boolean = true;
  // showLegendCO: boolean = true;
  // showXAxisLabelCO: boolean = true;
  // xAxisLabelCO: string = '';
  // showYAxisLabelCO: boolean = true;
  // yAxisLabelCO: string = 'Numbers';
  // legendTitleCO: string = 'Change Over';
  // colorSchemeCO = {
  //   domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  // };

  // //---------------------Changeover---------------------------------------

  // multiRS: any[];
  // viewRS: any[] = [400, 250];
  // // options
  // showXAxisRS: boolean = true;
  // showYAxisRS: boolean = true;
  // gradientRS: boolean = true;
  // showLegendRS: boolean = true;
  // showXAxisLabelRS: boolean = true;
  // xAxisLabelRS: string = '';
  // showYAxisLabelRS: boolean = true;
  // yAxisLabelRS: string = 'Numbers';
  // legendTitleRS: string = 'Rated Speed';
  // colorSchemeRS = {
  //   domain: ['#e36d7b', '#433ac2', '#AAAAAA']
  // };

  // //---------------------Manual Stop & Duration---------------------------------------
  // multiMSCount: any[];
  // viewMSCount: any[] = [400, 250];
  // // options
  // showXAxisMSCount: boolean = true;
  // showYAxisMSCount: boolean = true;
  // gradientMSCount: boolean = true;
  // showLegendMSCount: boolean = true;
  // showXAxisLabelMSCount: boolean = true;
  // xAxisLabelMSCount: string = '';
  // showYAxisLabelMSCount: boolean = true;
  // yAxisLabelMSCount: string = 'Numbers';
  // legendTitleMSCount: string = 'Manual Stop Count';
  // colorSchemeMSCount = {
  //   domain: ['#800080', '#C7B42C', '#660000']
  // };

  // //---------------------Run Time---------------------------------------
  // multiRTime: any[];
  // viewRTime: any[] = [400, 250];
  // // options
  // showXAxisRTime: boolean = true;
  // showYAxisRTime: boolean = true;
  // gradientRTime: boolean = true;
  // showLegendRTime: boolean = true;
  // showXAxisLabelRTime: boolean = true;
  // xAxisLabelRTime: string = '';
  // showYAxisLabelRTime: boolean = true;
  // yAxisLabelRTime: string = 'Numbers';
  // legendTitleRTime: string = 'Running Time';
  // colorSchemeRTime = {
  //   domain: ['#668cff', '#77b300', '#AAAAAA']
  // };

  // //------------------------------------------------------------
  // multiStackedBar: any[];
  // viewStackedBar: any[] = [400, 250];
  // // options
  // showXAxisStackedBar: boolean = true;
  // showYAxisStackedBar: boolean = true;
  // gradientStackedBar: boolean = true;
  // showLegendStackedBar: boolean = true;
  // showXAxisLabelStackedBar: boolean = true;
  // xAxisLabelStackedBar: string = '';
  // showYAxisLabelStackedBar: boolean = true;
  // yAxisLabelStackedBar: string = 'Numbers';
  // legendTitleStackedBar: string = 'Stacked View';
  // colorSchemeStackedBar = {
  //   domain: ['#C7B42C', '#5AA454', '#AAAAAA','#f0292f']
  // };
  // //---------------------------------------------------------------

  constructor() {
    // var multiCO = [
    //   {
    //     "name": "Operator 1",
    //     "series": [
    //       {
    //         "name": "Rated",
    //         "value": 100
    //       },
    //       {
    //         "name": "Actual",
    //         "value": 120
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 2",
    //     "series": [
    //       {
    //         "name": "Rated",
    //         "value": 90
    //       },
    //       {
    //         "name": "Actual",
    //         "value": 89
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 3",
    //     "series": [
    //       {
    //         "name": "Rated",
    //         "value": 80
    //       },
    //       {
    //         "name": "Actual",
    //         "value": 65
    //       }
    //     ]
    //   }
    // ];

    // var multiRS = [
    //   {
    //     "name": "Operator 1",
    //     "series": [
    //       {
    //         "name": "Rated",
    //         "value": 100
    //       },
    //       {
    //         "name": "Actual",
    //         "value": 120
    //       },
    //       {
    //         "name": "Average",
    //         "value": 100
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 2",
    //     "series": [
    //       {
    //         "name": "Rated",
    //         "value": 90
    //       },
    //       {
    //         "name": "Actual",
    //         "value": 89
    //       },
    //       {
    //         "name": "Average",
    //         "value": 100
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 3",
    //     "series": [
    //       {
    //         "name": "Rated",
    //         "value": 80
    //       },
    //       {
    //         "name": "Actual",
    //         "value": 65
    //       },
    //       {
    //         "name": "Average",
    //         "value": 100
    //       }
    //     ]
    //   }
    // ];

    // var multiMSCount = [
    //   {
    //     "name": "Operator 1",
    //     "series": [
    //       {
    //         "name": "Count/Duration",
    //         "value": 10
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 2",
    //     "series": [
    //       {
    //         "name": "Count/Duration",
    //         "value": 9
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 3",
    //     "series": [
    //       {
    //         "name": "Count/Duration",
    //         "value": 1
    //       }
    //     ]
    //   }
    // ];

    // var multiRTime = [
    //   {
    //     "name": "Operator 1",
    //     "series": [
    //       {
    //         "name": "Run Time",
    //         "value": 350
    //       },
    //       {
    //         "name": "Total Time",
    //         "value": 480
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 2",
    //     "series": [
    //       {
    //         "name": "Run Time",
    //         "value": 300
    //       },
    //       {
    //         "name": "Total Time",
    //         "value": 480
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 3",
    //     "series": [
    //       {
    //         "name": "Run Time",
    //         "value": 210
    //       },
    //       {
    //         "name": "Total Time",
    //         "value": 480
    //       }
    //     ]
    //   }
    // ];

    // var multiStackedBar = [
    //   {
    //     "name": "Operator 1",
    //     "series": [
    //       {
    //         "name": "Change Over",
    //         "value": 10
    //       },
    //       {
    //         "name": "Run",
    //         "value": 60
    //       },
    //       {
    //         "name": "Manual Stop",
    //         "value": 5
    //       },
    //       {
    //         "name": "Breakdown",
    //         "value": 25
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 2",
    //     "series": [
    //       {
    //         "name": "Change Over",
    //         "value": 40
    //       },
    //       {
    //         "name": "Run",
    //         "value": 30
    //       },
    //       {
    //         "name": "Manual Stop",
    //         "value": 10
    //       },
    //       {
    //         "name": "Breakdown",
    //         "value": 20
    //       }
    //     ]
    //   },

    //   {
    //     "name": "Operator 3",
    //     "series": [
    //       {
    //         "name": "Change Over",
    //         "value": 0
    //       },
    //       {
    //         "name": "Run",
    //         "value": 9
    //       },
    //       {
    //         "name": "Manual Stop",
    //         "value": 81
    //       },
    //       {
    //         "name": "Breakdown",
    //         "value": 10
    //       }
    //     ]
    //   }
    // ];
    // Object.assign(this, { multiCO });
    // Object.assign(this, { multiRS });
    // Object.assign(this, { multiMSCount });
    // Object.assign(this, { multiRTime });
    // Object.assign(this, { multiStackedBar });

  }
  ngOnInit() { }

  // onSelect(data): void {
  // }

  // onActivate(data): void {
  // }

  // onDeactivate(data): void {
  // }
}
