import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeovertypeComponent } from './changeovertype.component';

describe('ChangeovertypeComponent', () => {
  let component: ChangeovertypeComponent;
  let fixture: ComponentFixture<ChangeovertypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeovertypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeovertypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
