import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectreworkComponent } from './rejectrework.component';

describe('RejectreworkComponent', () => {
  let component: RejectreworkComponent;
  let fixture: ComponentFixture<RejectreworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectreworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectreworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
