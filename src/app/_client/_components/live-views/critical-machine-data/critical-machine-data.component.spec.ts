import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalMachineDataComponent } from './critical-machine-data.component';

describe('CriticalMachineDataComponent', () => {
  let component: CriticalMachineDataComponent;
  let fixture: ComponentFixture<CriticalMachineDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalMachineDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalMachineDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
