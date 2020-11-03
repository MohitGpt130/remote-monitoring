import { Observer, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventsAnalysisService {
  lineConfig: Observer<any>;

  constructor(private httpClient: HttpClient) {
    // this.getLineConfig('line1').subscribe();
  }

  getLineConfig(line): Observable<any> {
    this.httpClient
      .get('configs/lines.config.json')
      .subscribe((linesConfigs: any) => {
        if (linesConfigs[line]) {
          this.lineConfig.next(linesConfigs[line]);
        } else {
          const lineConfig = linesConfigs['default-line'];
          Object.keys(lineConfig).forEach(element => {
            lineConfig[element].data += line;
          });
          this.lineConfig.next(lineConfig);
        }
      });

    return new Observable((observer) => {
      this.lineConfig = observer;
    });
  }

  // getLineConfigData(line): Observable<any> {
  //   this.httpClient
  //     .get('configs/lines.config.json')
  //     .subscribe((linesConfigs: any) => {
  //       if (linesConfigs[line]) {
  //         this.lineConfig.next(linesConfigs[line]);
  //       } else {
  //         const lineConfig = linesConfigs['default-line'];
  //         lineConfig.analysedSummaryDataAPI.data += line;
  //         Object.keys(lineConfig).forEach(element => {
  //           lineConfig[element].data += line;
  //         });
  //         this.lineConfig.next(lineConfig);
  //       }
  //     });

  //   return new Observable((observer) => {
  //     this.lineConfig = observer;
  //   });
  // }
}
