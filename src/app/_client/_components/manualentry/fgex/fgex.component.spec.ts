import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FgexComponent } from './fgex.component';

describe('FgexComponent', () => {
  let component: FgexComponent;
  let fixture: ComponentFixture<FgexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FgexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
