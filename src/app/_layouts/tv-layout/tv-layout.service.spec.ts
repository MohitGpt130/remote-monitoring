import { TestBed } from '@angular/core/testing';

import { TvLayoutService } from './tv-layout.service';

describe('TvLayoutService', () => {
  let service: TvLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TvLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
