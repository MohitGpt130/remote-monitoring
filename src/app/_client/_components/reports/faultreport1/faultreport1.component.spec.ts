import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Faultreport1Component } from './faultreport1.component';

describe('Faultreport1Component', () => {
  let component: Faultreport1Component;
  let fixture: ComponentFixture<Faultreport1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Faultreport1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Faultreport1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
