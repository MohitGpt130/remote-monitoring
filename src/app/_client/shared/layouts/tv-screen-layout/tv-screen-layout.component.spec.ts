import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvScreenLayoutComponent } from './tv-screen-layout.component';

describe('TvScreenLayoutComponent', () => {
  let component: TvScreenLayoutComponent;
  let fixture: ComponentFixture<TvScreenLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvScreenLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvScreenLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
