import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdtSchedulingComponent } from './pdt-scheduling.component';

describe('PdtSchedulingComponent', () => {
  let component: PdtSchedulingComponent;
  let fixture: ComponentFixture<PdtSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdtSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdtSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
