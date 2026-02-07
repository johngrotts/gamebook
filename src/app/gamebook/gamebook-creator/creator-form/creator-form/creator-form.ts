import {Component, inject, Input} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Story} from '../../../../models/story';
import {MatIcon} from '@angular/material/icon';
import * as simpleStory from '../../../../test-data/simple-story-1.json';

@Component({
  selector: 'app-creator-form',
  imports: [
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: './creator-form.html',
  styleUrl: './creator-form.scss',
})
export class CreatorForm {
  private formBuilder = inject(FormBuilder);
  protected currentDate = new Date();
  @Input() currentStory: Story;

  constructor() {
    this.currentStory = simpleStory;


    if(this.currentStory) {
      this.patchStoryValues(this.currentStory);
    }
  }

  protected storyForm = this.formBuilder.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    copyright: [this.currentDate.getFullYear().toString(), Validators.required],
    draft: [true, Validators.required],
    pages: this.formBuilder.array([])
  }, {updateOn: 'blur'});

  onSubmit() {
    console.warn(this.storyForm.value)
  }

  patchStoryValues(story: Story) {
    this.storyForm.patchValue({title: story.title, author: story.author, copyright: story.copyright});
    story.pages?.forEach((page, i) => {
      this.addPage();
      this.getPage(i).patchValue(page);
      page.paths?.forEach((path, j) => {
        this.addPath(i);
        this.getPath(i,j).patchValue(path);
      })
    });
  }

  get pages() {
    return this.storyForm.get('pages') as FormArray<FormGroup>;
  }
  newPage() {
    return this.formBuilder.group({
      id: [this.pages.length, Validators.required],
      title: ['', Validators.required],
      pageText: ['', Validators.required],
      start: [false, Validators.required],
      end: [false, Validators.required],
      paths: this.formBuilder.array([])
    })
  }
  getPage(index: number) {
    return this.pages.at(index);
  }
  addPage() {
    this.pages.push(this.newPage());
  }
  removePage(index: number): void {
    this.pages.removeAt(index);
  }

  getPaths(pageIndex: number) {
    return this.getPage(pageIndex).get('paths') as FormArray<FormGroup>;
  }
  newPath() {
    return this.formBuilder.group({
      text: ['', Validators.required],
      goToPage: ['', Validators.required],
    });
  }
  addPath(pageIndex: number) {
    this.getPaths(pageIndex).push(this.newPath());
  }
  getPath(pageIndex: number, pathIndex: number) {
    return this.getPaths(pageIndex).at(pathIndex);
  }
  removePath(pageIndex: number, pathIndex: number): void {
    this.getPaths(pageIndex).removeAt(pathIndex);
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
