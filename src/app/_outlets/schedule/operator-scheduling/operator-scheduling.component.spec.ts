import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorSchedulingComponent } from './operator-scheduling.component';

describe('OperatorSchedulingComponent', () => {
  let component: OperatorSchedulingComponent;
  let fixture: ComponentFixture<OperatorSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
