import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sfw-header',
  templateUrl: './sfw-header.component.html',
  styleUrls: ['./sfw-header.component.scss']
})
export class SfwHeaderComponent implements OnInit {
  @Input() headerInfo: any = {
    currentTime: new Date(),
    currentShift: '-',
    shiftTimings: '-',
  };

  constructor(
    private httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      this.getHeaderInfo();
    }, 60 * 1000);
  }

  getHeaderInfo(): void {
    this.httpClient.get('https://dashboard.testing.smartfactoryworx.net/api/shift/shift/all?line_id=5f0809fdc2b1ce30cc53eb8d').subscribe((data: any) => {
      this.headerInfo.currentTime = data[0].date;
      this.headerInfo.currentShift = data[0].shift;
      this.headerInfo.shiftTimings = '-';
    });
  }

  logout(): void {

  }
}
