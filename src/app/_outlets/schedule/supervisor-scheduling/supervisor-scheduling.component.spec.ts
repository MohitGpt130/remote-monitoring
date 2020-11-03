import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorSchedulingComponent } from './supervisor-scheduling.component';

describe('SupervisorSchedulingComponent', () => {
  let component: SupervisorSchedulingComponent;
  let fixture: ComponentFixture<SupervisorSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
