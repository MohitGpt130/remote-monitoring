import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectReworkComponent } from './reject-rework.component';

describe('RejectReworkComponent', () => {
  let component: RejectReworkComponent;
  let fixture: ComponentFixture<RejectReworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectReworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectReworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
