import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatordailogentryComponent } from './operatordailogentry.component';

describe('OperatordailogentryComponent', () => {
  let component: OperatordailogentryComponent;
  let fixture: ComponentFixture<OperatordailogentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatordailogentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatordailogentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
