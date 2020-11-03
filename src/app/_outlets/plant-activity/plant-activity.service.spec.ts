import { TestBed } from '@angular/core/testing';

import { PlantActivityService } from './plant-activity.service';

describe('PlantActivityService', () => {
  let service: PlantActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
