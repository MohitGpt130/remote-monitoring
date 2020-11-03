import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchskuentryComponent } from './batchskuentry.component';

describe('BatchskuentryComponent', () => {
  let component: BatchskuentryComponent;
  let fixture: ComponentFixture<BatchskuentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchskuentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchskuentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
