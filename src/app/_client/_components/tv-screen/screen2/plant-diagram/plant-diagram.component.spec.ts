import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDiagramComponent } from './plant-diagram.component';

describe('PlantDiagramComponent', () => {
  let component: PlantDiagramComponent;
  let fixture: ComponentFixture<PlantDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
