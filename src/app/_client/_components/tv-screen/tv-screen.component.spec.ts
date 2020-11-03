import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvScreenComponent } from './tv-screen.component';

describe('TvScreenComponent', () => {
  let component: TvScreenComponent;
  let fixture: ComponentFixture<TvScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
