import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailGridComponent } from './trail-grid.component';

describe('TrailGridComponent', () => {
  let component: TrailGridComponent;
  let fixture: ComponentFixture<TrailGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
