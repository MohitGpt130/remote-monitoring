import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCircularComponent } from './email-circular.component';

describe('EmailCircularComponent', () => {
  let component: EmailCircularComponent;
  let fixture: ComponentFixture<EmailCircularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailCircularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
