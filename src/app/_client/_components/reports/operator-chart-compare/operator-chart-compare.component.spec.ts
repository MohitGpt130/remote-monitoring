import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorChartCompareComponent } from './operator-chart-compare.component';

describe('OperatorChartCompareComponent', () => {
  let component: OperatorChartCompareComponent;
  let fixture: ComponentFixture<OperatorChartCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorChartCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorChartCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
