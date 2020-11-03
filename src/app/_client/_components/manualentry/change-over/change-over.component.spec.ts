import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOverComponent } from './change-over.component';

describe('ChangeOverComponent', () => {
  let component: ChangeOverComponent;
  let fixture: ComponentFixture<ChangeOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
