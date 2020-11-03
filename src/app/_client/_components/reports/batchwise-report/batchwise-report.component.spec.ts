import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchwiseReportComponent } from './batchwise-report.component';

describe('BatchwiseReportComponent', () => {
  let component: BatchwiseReportComponent;
  let fixture: ComponentFixture<BatchwiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchwiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
