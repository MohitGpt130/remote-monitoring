import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetuptimeComponent } from './setuptime.component';

describe('SetuptimeComponent', () => {
  let component: SetuptimeComponent;
  let fixture: ComponentFixture<SetuptimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetuptimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetuptimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
