import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCausesDataTableComponent } from './event-causes-data-table.component';

describe('EventCausesDataTableComponent', () => {
  let component: EventCausesDataTableComponent;
  let fixture: ComponentFixture<EventCausesDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCausesDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCausesDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
