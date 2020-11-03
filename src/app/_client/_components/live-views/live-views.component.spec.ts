import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveViewsComponent } from './live-views.component';

describe('LiveViewsComponent', () => {
  let component: LiveViewsComponent;
  let fixture: ComponentFixture<LiveViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
