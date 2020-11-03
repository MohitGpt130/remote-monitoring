import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftformComponent } from './shiftform.component';

describe('ShiftformComponent', () => {
  let component: ShiftformComponent;
  let fixture: ComponentFixture<ShiftformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
