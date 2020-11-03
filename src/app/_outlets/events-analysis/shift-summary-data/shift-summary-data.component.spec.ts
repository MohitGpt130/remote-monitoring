import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftSummaryDataComponent } from './shift-summary-data.component';

describe('ShiftSummaryDataComponent', () => {
  let component: ShiftSummaryDataComponent;
  let fixture: ComponentFixture<ShiftSummaryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftSummaryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftSummaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
