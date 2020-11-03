import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateMasterComponent } from './email-template-master.component';

describe('EmailTemplateMasterComponent', () => {
  let component: EmailTemplateMasterComponent;
  let fixture: ComponentFixture<EmailTemplateMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
