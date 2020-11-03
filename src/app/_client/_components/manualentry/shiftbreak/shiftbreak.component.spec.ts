import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftbreakComponent } from './shiftbreak.component';

describe('ShiftbreakComponent', () => {
  let component: ShiftbreakComponent;
  let fixture: ComponentFixture<ShiftbreakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftbreakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftbreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
