import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultcauseReportComponent } from './faultcause-report.component';

describe('FaultcauseReportComponent', () => {
  let component: FaultcauseReportComponent;
  let fixture: ComponentFixture<FaultcauseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaultcauseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultcauseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
