import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantdowntimeComponent } from './plantdowntime.component';

describe('PlantdowntimeComponent', () => {
  let component: PlantdowntimeComponent;
  let fixture: ComponentFixture<PlantdowntimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantdowntimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantdowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
