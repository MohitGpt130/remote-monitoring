import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyoffformComponent } from './weeklyoffform.component';

describe('WeeklyoffformComponent', () => {
  let component: WeeklyoffformComponent;
  let fixture: ComponentFixture<WeeklyoffformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyoffformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyoffformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
