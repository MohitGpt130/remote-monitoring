import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatdailogComponent } from './formatdailog.component';

describe('FormatdailogComponent', () => {
  let component: FormatdailogComponent;
  let fixture: ComponentFixture<FormatdailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatdailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatdailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
