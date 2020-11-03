import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeovertypedailogComponent } from './changeovertypedailog.component';

describe('ChangeovertypedailogComponent', () => {
  let component: ChangeovertypedailogComponent;
  let fixture: ComponentFixture<ChangeovertypedailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeovertypedailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeovertypedailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
