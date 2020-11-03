import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineformComponent } from './lineform.component';

describe('LineformComponent', () => {
  let component: LineformComponent;
  let fixture: ComponentFixture<LineformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
