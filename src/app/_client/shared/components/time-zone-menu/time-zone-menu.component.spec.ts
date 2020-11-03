import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeZoneMenuComponent } from './time-zone-menu.component';

describe('TimeZoneMenuComponent', () => {
  let component: TimeZoneMenuComponent;
  let fixture: ComponentFixture<TimeZoneMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeZoneMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeZoneMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
