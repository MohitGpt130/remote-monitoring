import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobaltypedailogComponent } from './globaltypedailog.component';

describe('GlobaltypedailogComponent', () => {
  let component: GlobaltypedailogComponent;
  let fixture: ComponentFixture<GlobaltypedailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobaltypedailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobaltypedailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
