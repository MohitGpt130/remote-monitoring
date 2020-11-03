import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopInputFormComponent } from './stop-input-form.component';

describe('StopInputFormComponent', () => {
  let component: StopInputFormComponent;
  let fixture: ComponentFixture<StopInputFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopInputFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
