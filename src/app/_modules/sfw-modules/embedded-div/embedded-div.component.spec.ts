import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedDivComponent } from './embedded-div.component';

describe('EmbeddedDivComponent', () => {
  let component: EmbeddedDivComponent;
  let fixture: ComponentFixture<EmbeddedDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
