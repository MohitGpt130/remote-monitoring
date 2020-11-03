import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdtdefinitiondailogComponent } from './updtdefinitiondailog.component';

describe('UpdtdefinitiondailogComponent', () => {
  let component: UpdtdefinitiondailogComponent;
  let fixture: ComponentFixture<UpdtdefinitiondailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdtdefinitiondailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdtdefinitiondailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
