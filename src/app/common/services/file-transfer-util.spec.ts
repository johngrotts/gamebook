import { TestBed } from '@angular/core/testing';

import { FileTransferUtil } from './file-transfer-util';

describe('FileTransferUtil', () => {
  let service: FileTransferUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileTransferUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
