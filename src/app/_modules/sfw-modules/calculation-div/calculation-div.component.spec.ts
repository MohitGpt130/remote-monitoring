import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationDivComponent } from './calculation-div.component';

describe('CalculationDivComponent', () => {
  let component: CalculationDivComponent;
  let fixture: ComponentFixture<CalculationDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculationDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
