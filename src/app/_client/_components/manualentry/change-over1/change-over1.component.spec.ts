import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOver1Component } from './change-over1.component';

describe('ChangeOver1Component', () => {
  let component: ChangeOver1Component;
  let fixture: ComponentFixture<ChangeOver1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOver1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOver1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
