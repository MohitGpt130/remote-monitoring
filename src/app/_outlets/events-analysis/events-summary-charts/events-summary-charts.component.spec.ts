import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSummaryChartsComponent } from './events-summary-charts.component';

describe('EventsSummaryChartsComponent', () => {
  let component: EventsSummaryChartsComponent;
  let fixture: ComponentFixture<EventsSummaryChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsSummaryChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsSummaryChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
