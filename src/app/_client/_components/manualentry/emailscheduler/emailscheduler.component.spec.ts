import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailschedulerComponent } from './emailscheduler.component';

describe('EmailschedulerComponent', () => {
  let component: EmailschedulerComponent;
  let fixture: ComponentFixture<EmailschedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailschedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailschedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
