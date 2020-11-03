import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalkeydailogComponent } from './globalkeydailog.component';

describe('GlobalkeydailogComponent', () => {
  let component: GlobalkeydailogComponent;
  let fixture: ComponentFixture<GlobalkeydailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalkeydailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalkeydailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
