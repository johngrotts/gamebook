import { TestBed } from '@angular/core/testing';

import { CommonUtil } from './common-util';

describe('CommonUtil', () => {
  let service: CommonUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
