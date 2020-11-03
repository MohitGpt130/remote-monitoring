import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantActivityComponent } from './plant-activity.component';

describe('PlantActivityComponent', () => {
  let component: PlantActivityComponent;
  let fixture: ComponentFixture<PlantActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
