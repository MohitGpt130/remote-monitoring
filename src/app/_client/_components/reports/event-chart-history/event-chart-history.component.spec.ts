import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChartHistoryComponent } from './event-chart-history.component';

describe('EventChartHistoryComponent', () => {
  let component: EventChartHistoryComponent;
  let fixture: ComponentFixture<EventChartHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventChartHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChartHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

