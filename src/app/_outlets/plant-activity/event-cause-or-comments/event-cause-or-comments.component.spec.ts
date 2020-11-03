import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCauseOrCommentsComponent } from './event-cause-or-comments.component';

describe('EventCauseOrCommentsComponent', () => {
  let component: EventCauseOrCommentsComponent;
  let fixture: ComponentFixture<EventCauseOrCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCauseOrCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCauseOrCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
