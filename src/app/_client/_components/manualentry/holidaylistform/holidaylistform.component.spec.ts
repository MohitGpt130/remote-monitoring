import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaylistformComponent } from './holidaylistform.component';

describe('HolidaylistformComponent', () => {
  let component: HolidaylistformComponent;
  let fixture: ComponentFixture<HolidaylistformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaylistformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaylistformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
