import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLayoutComponent } from './dynamic-layout.component';

describe('DynamicLayoutComponent', () => {
  let component: DynamicLayoutComponent;
  let fixture: ComponentFixture<DynamicLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
