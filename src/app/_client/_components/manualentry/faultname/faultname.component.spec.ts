import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultnameComponent } from './faultname.component';

describe('FaultnameComponent', () => {
  let component: FaultnameComponent;
  let fixture: ComponentFixture<FaultnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaultnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
