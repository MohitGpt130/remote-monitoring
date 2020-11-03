import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossdailogComponent } from './lossdailog.component';

describe('LossdailogComponent', () => {
  let component: LossdailogComponent;
  let fixture: ComponentFixture<LossdailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossdailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossdailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
