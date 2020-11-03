import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultcauseformComponent } from './faultcauseform.component';

describe('FaultcauseformComponent', () => {
  let component: FaultcauseformComponent;
  let fixture: ComponentFixture<FaultcauseformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaultcauseformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultcauseformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
