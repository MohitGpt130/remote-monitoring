import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivelistmasterComponent } from './preventivelistmaster.component';

describe('PreventivelistmasterComponent', () => {
  let component: PreventivelistmasterComponent;
  let fixture: ComponentFixture<PreventivelistmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivelistmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivelistmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
