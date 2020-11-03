import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineParametersTableComponent } from './machine-parameters-table.component';

describe('MachineParametersTableComponent', () => {
  let component: MachineParametersTableComponent;
  let fixture: ComponentFixture<MachineParametersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineParametersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineParametersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
