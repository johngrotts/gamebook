import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamebookHome } from './gamebook-home';

describe('GamebookHome', () => {
  let component: GamebookHome;
  let fixture: ComponentFixture<GamebookHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamebookHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamebookHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
