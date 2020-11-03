import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinewiseOperatorComponent } from './machinewise-operator.component';

describe('MachinewiseOperatorComponent', () => {
  let component: MachinewiseOperatorComponent;
  let fixture: ComponentFixture<MachinewiseOperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinewiseOperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinewiseOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
