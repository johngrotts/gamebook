import { TestBed } from '@angular/core/testing';

import { GamebookValidator } from './gamebook-validator';
import * as simpleStory from '../../../test-data/simple-story-1.json';
import {Story} from '../../../models/story';

describe('GamebookValidator', () => {
  let service: GamebookValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamebookValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly validate a simple story', () => {
    const results = service.validateStoryStructure(simpleStory as Story);
    expect(results.foundErrors).toBeFalsy;
  })
});
