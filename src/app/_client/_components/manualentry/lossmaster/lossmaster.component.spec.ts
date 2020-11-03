import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossmasterComponent } from './lossmaster.component';

describe('LossmasterComponent', () => {
  let component: LossmasterComponent;
  let fixture: ComponentFixture<LossmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
