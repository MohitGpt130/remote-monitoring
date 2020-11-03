import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridTrailReportComponent } from './ag-grid-trail-report.component';

describe('AgGridTrailReportComponent', () => {
  let component: AgGridTrailReportComponent;
  let fixture: ComponentFixture<AgGridTrailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridTrailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridTrailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
