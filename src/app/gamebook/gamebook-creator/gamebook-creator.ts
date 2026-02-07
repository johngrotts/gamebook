import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreatorForm} from './creator-form/creator-form/creator-form';

@Component({
  selector: 'app-gamebook-creator',
  imports: [
    CreatorForm,
  ],
  templateUrl: './gamebook-creator.html',
  styleUrl: './gamebook-creator.scss',
})
export class GamebookCreator implements OnInit {

  storyForm: FormGroup;

  constructor(protected fb: FormBuilder) {
  }

  ngOnInit() {
    const today = new Date();
    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      copyright: [today.getFullYear().toString()],
      draft: [true],
      pages: this.fb.array([])
    });
  }

}
