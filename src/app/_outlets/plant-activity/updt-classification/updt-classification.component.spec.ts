import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdtClassificationComponent } from './updt-classification.component';

describe('UpdtClassificationComponent', () => {
  let component: UpdtClassificationComponent;
  let fixture: ComponentFixture<UpdtClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdtClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdtClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
