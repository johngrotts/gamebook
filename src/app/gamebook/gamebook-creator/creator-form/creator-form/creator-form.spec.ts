import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorForm } from './creator-form';

describe('CreatorForm', () => {
  let component: CreatorForm;
  let fixture: ComponentFixture<CreatorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatorForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
