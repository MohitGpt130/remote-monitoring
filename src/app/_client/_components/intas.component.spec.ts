import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntasComponent } from './intas.component';

describe('IntasComponent', () => {
  let component: IntasComponent;
  let fixture: ComponentFixture<IntasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
