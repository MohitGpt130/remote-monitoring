import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulemaintainenceformComponent } from './schedulemaintainenceform.component';

describe('SchedulemaintainenceformComponent', () => {
  let component: SchedulemaintainenceformComponent;
  let fixture: ComponentFixture<SchedulemaintainenceformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulemaintainenceformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulemaintainenceformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
