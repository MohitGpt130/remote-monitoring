import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtestOverComponent } from './ctest-over.component';

describe('CtestOverComponent', () => {
  let component: CtestOverComponent;
  let fixture: ComponentFixture<CtestOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtestOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtestOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
