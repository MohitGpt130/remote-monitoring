import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsAnalysisComponent } from './events-analysis.component';

describe('EventsAnalysisComponent', () => {
  let component: EventsAnalysisComponent;
  let fixture: ComponentFixture<EventsAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
