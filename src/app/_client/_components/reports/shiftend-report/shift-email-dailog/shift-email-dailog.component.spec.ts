import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftEmailDailogComponent } from './shift-email-dailog.component';

describe('ShiftEmailDailogComponent', () => {
  let component: ShiftEmailDailogComponent;
  let fixture: ComponentFixture<ShiftEmailDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftEmailDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftEmailDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
