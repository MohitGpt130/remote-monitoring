import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtemplatedailogComponent } from './emailtemplatedailog.component';

describe('EmailtemplatedailogComponent', () => {
  let component: EmailtemplatedailogComponent;
  let fixture: ComponentFixture<EmailtemplatedailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailtemplatedailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailtemplatedailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
