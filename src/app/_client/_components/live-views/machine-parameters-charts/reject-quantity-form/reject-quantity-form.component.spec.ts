import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectQuantityFormComponent } from './reject-quantity-form.component';

describe('RejectQuantityFormComponent', () => {
  let component: RejectQuantityFormComponent;
  let fixture: ComponentFixture<RejectQuantityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectQuantityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectQuantityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
