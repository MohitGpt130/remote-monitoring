import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTimelineChartComponent } from './events-timeline-chart.component';

describe('EventsTimelineChartComponent', () => {
  let component: EventsTimelineChartComponent;
  let fixture: ComponentFixture<EventsTimelineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsTimelineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsTimelineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
