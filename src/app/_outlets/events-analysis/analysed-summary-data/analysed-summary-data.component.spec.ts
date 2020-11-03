import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysedSummaryDataComponent } from './analysed-summary-data.component';

describe('AnalysedSummaryDataComponent', () => {
  let component: AnalysedSummaryDataComponent;
  let fixture: ComponentFixture<AnalysedSummaryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysedSummaryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysedSummaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
