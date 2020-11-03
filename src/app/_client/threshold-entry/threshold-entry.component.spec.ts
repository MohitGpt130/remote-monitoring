import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdEntryComponent } from './threshold-entry.component';

describe('ThresholdEntryComponent', () => {
  let component: ThresholdEntryComponent;
  let fixture: ComponentFixture<ThresholdEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThresholdEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
