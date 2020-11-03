import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultListComponent } from './fault-list.component';

describe('FaultListComponent', () => {
  let component: FaultListComponent;
  let fixture: ComponentFixture<FaultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
