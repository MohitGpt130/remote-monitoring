import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailschedulerdailogComponent } from './emailschedulerdailog.component';

describe('EmailschedulerdailogComponent', () => {
  let component: EmailschedulerdailogComponent;
  let fixture: ComponentFixture<EmailschedulerdailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailschedulerdailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailschedulerdailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
