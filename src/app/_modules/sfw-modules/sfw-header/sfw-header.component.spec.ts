import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SfwHeaderComponent } from './sfw-header.component';

describe('SfwHeaderComponent', () => {
  let component: SfwHeaderComponent;
  let fixture: ComponentFixture<SfwHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SfwHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SfwHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
