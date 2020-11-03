import { TestBed } from '@angular/core/testing';

import { SfwLayoutService } from './sfw-layout.service';

describe('SfwLayoutService', () => {
  let service: SfwLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SfwLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
