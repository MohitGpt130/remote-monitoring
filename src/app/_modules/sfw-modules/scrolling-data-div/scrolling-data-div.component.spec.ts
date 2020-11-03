import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollingDataDivComponent } from './scrolling-data-div.component';

describe('ScrollingDataDivComponent', () => {
  let component: ScrollingDataDivComponent;
  let fixture: ComponentFixture<ScrollingDataDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollingDataDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollingDataDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
