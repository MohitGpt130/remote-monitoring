import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FgexdailogComponent } from './fgexdailog.component';

describe('FgexdailogComponent', () => {
  let component: FgexdailogComponent;
  let fixture: ComponentFixture<FgexdailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FgexdailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgexdailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
