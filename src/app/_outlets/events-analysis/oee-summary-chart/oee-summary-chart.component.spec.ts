import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OeeSummaryChartComponent } from './oee-summary-chart.component';

describe('OeeSummaryChartComponent', () => {
  let component: OeeSummaryChartComponent;
  let fixture: ComponentFixture<OeeSummaryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OeeSummaryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OeeSummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
