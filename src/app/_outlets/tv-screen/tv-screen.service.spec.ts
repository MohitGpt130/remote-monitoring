import { TestBed } from '@angular/core/testing';

import { TvScreenService } from './tv-screen.service';

describe('TvScreenService', () => {
  let service: TvScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TvScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
