import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizeAccessComponent } from './unauthorize-access.component';

describe('UnauthorizeAccessComponent', () => {
  let component: UnauthorizeAccessComponent;
  let fixture: ComponentFixture<UnauthorizeAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthorizeAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizeAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
