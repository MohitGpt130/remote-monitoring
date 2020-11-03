import { TestBed } from '@angular/core/testing';

import { Screen1Service } from './screen1.service';

describe('Screen1Service', () => {
  let service: Screen1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Screen1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
