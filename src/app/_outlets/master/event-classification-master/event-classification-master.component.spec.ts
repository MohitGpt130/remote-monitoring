import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClassificationMasterComponent } from './event-classification-master.component';

describe('EventClassificationMasterComponent', () => {
  let component: EventClassificationMasterComponent;
  let fixture: ComponentFixture<EventClassificationMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventClassificationMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClassificationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
