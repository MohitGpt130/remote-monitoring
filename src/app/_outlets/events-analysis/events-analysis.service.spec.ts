import { TestBed } from '@angular/core/testing';

import { EventsAnalysisService } from './events-analysis.service';

describe('EventsAnalysisService', () => {
  let service: EventsAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
