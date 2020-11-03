import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopVideoComponent } from './stop-video.component';

describe('StopVideoComponent', () => {
  let component: StopVideoComponent;
  let fixture: ComponentFixture<StopVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
