import { TestBed } from '@angular/core/testing';

import { VcCalendarService } from './vc-calendar.service';

describe('VcCalendarService', () => {
  let service: VcCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VcCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
