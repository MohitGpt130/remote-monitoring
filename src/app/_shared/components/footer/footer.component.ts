import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() visible = false;
  @Input() companyName = '';
  @Input() buildDate;
  @Input() appVersion = '';
  @Input() updateDaysDiff;
  @Input() newUpdateOrUpgrade;
  @Input() dataObject;

  constructor() { }

  ngOnInit(): void {
  }

}
