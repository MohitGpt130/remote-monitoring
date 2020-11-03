import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdDivComponent } from './threshold-div.component';

describe('ThresholdDivComponent', () => {
  let component: ThresholdDivComponent;
  let fixture: ComponentFixture<ThresholdDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThresholdDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
