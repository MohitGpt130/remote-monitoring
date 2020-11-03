import { TestBed } from '@angular/core/testing';

import { Screen2Service } from './screen2.service';

describe('Screen2Service', () => {
  let service: Screen2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Screen2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
