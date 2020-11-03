import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Manualentry1Component } from './manualentry1.component';

describe('Manualentry1Component', () => {
  let component: Manualentry1Component;
  let fixture: ComponentFixture<Manualentry1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Manualentry1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Manualentry1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
