import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalkeymasterComponent } from './globalkeymaster.component';

describe('GlobalkeymasterComponent', () => {
  let component: GlobalkeymasterComponent;
  let fixture: ComponentFixture<GlobalkeymasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalkeymasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalkeymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
