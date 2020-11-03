import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultList2Component } from './fault-list2.component';

describe('FaultList2Component', () => {
  let component: FaultList2Component;
  let fixture: ComponentFixture<FaultList2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaultList2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
