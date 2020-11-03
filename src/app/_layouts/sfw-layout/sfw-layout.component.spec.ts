import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SfwLayoutComponent } from './sfw-layout.component';

describe('SfwLayoutComponent', () => {
  let component: SfwLayoutComponent;
  let fixture: ComponentFixture<SfwLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SfwLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SfwLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
