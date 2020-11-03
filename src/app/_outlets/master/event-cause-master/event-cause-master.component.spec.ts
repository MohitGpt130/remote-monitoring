import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCauseMasterComponent } from './event-cause-master.component';

describe('EventCauseMasterComponent', () => {
  let component: EventCauseMasterComponent;
  let fixture: ComponentFixture<EventCauseMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCauseMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCauseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
