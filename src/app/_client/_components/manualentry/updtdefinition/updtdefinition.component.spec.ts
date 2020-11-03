import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdtdefinitionComponent } from './updtdefinition.component';

describe('UpdtdefinitionComponent', () => {
  let component: UpdtdefinitionComponent;
  let fixture: ComponentFixture<UpdtdefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdtdefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdtdefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
