import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftEndFormComponent } from './shift-end-form.component';

describe('ShiftEndFormComponent', () => {
  let component: ShiftEndFormComponent;
  let fixture: ComponentFixture<ShiftEndFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftEndFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftEndFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
