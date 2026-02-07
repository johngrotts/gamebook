import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamebookCreator } from './gamebook-creator';

describe('GamebookCreator', () => {
  let component: GamebookCreator;
  let fixture: ComponentFixture<GamebookCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamebookCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamebookCreator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
