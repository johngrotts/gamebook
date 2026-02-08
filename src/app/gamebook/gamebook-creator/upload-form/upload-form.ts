import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-upload-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './upload-form.html',
  styleUrl: './upload-form.scss',
})
export class UploadForm {
  private formBuilder = inject(FormBuilder);
  selectedFile: File | null = null;
  fileContent: string | ArrayBuffer | null = '';
  storyUploadForm = this.formBuilder.group({
    jsonStory: new FormControl('', [Validators.required]),
  })

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.readFile(files[0]);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fileContent = e.target.result;
      this.storyUploadForm.patchValue({jsonStory: JSON.parse(JSON.stringify(this.fileContent,null,2))});
      // You can now process the content (e.g., parse CSV, JSON)
    };
    reader.onerror = (e: any) => {
      console.error('File reading error: ', e);
    };
    reader.readAsText(file);

  }

  clearFile(): void {
    this.selectedFile = null;
  }
  clearJsonBox(): void {
    this.storyUploadForm.reset();
  }

  onSubmit(): void {
    try{
      const jsonString = this.storyUploadForm?.get('jsonStory')?.value?? '';
      console.log(JSON.parse(jsonString))
    } catch (error) {
      console.error(error);
    }
  }
}
