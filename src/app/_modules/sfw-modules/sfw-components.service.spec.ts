import { TestBed } from '@angular/core/testing';

import { SfwComponentsService } from './sfw-components.service';

describe('SfwComponentsService', () => {
  let service: SfwComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SfwComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
