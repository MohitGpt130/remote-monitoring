import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeDivComponent } from './pipe-div.component';

describe('PipeDivComponent', () => {
  let component: PipeDivComponent;
  let fixture: ComponentFixture<PipeDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
