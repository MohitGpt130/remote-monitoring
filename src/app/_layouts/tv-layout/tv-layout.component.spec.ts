import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvLayoutComponent } from './tv-layout.component';

describe('TvLayoutComponent', () => {
  let component: TvLayoutComponent;
  let fixture: ComponentFixture<TvLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
