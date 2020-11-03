import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchChangeComponent } from './batch-change.component';

describe('BatchChangeComponent', () => {
  let component: BatchChangeComponent;
  let fixture: ComponentFixture<BatchChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
