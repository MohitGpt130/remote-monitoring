import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftendReportComponent } from './shiftend-report.component';

describe('ShiftendReportComponent', () => {
  let component: ShiftendReportComponent;
  let fixture: ComponentFixture<ShiftendReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftendReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
