import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineParametersChartsComponent } from './machine-parameters-charts.component';

describe('MachineParametersChartsComponent', () => {
  let component: MachineParametersChartsComponent;
  let fixture: ComponentFixture<MachineParametersChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineParametersChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineParametersChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
