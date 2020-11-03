import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezonMenuComponent } from './timezon-menu.component';

describe('TimezonMenuComponent', () => {
  let component: TimezonMenuComponent;
  let fixture: ComponentFixture<TimezonMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimezonMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
