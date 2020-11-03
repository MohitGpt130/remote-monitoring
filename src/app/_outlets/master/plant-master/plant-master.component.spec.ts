import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMasterComponent } from './plant-master.component';

describe('PlantMasterComponent', () => {
  let component: PlantMasterComponent;
  let fixture: ComponentFixture<PlantMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
