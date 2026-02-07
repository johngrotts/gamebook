import { Routes } from '@angular/router';
import {GamebookCreator} from './gamebook/gamebook-creator/gamebook-creator';
import {GamebookHome} from './gamebook/gamebook-home/gamebook-home';
import {UploadForm} from './gamebook/gamebook-creator/upload-form/upload-form';

export const routes: Routes = [
  { path: 'home', component: GamebookHome },
  { path: 'creator', component: GamebookCreator },
  { path: 'upload', component: UploadForm },
];
