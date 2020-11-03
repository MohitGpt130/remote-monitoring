import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobaltypeComponent } from './globaltype.component';

describe('GlobaltypeComponent', () => {
  let component: GlobaltypeComponent;
  let fixture: ComponentFixture<GlobaltypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobaltypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobaltypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
