import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorentryComponent } from './operatorentry.component';

describe('OperatorentryComponent', () => {
  let component: OperatorentryComponent;
  let fixture: ComponentFixture<OperatorentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
