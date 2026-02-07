import { TestBed } from '@angular/core/testing';

import { PagesQuestionService } from './pages-question-service';

describe('PagesQuestionService', () => {
  let service: PagesQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagesQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
