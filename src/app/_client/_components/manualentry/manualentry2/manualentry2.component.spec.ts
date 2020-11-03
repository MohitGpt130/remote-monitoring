import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Manualentry2Component } from './manualentry2.component';

describe('Manualentry2Component', () => {
  let component: Manualentry2Component;
  let fixture: ComponentFixture<Manualentry2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Manualentry2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Manualentry2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
