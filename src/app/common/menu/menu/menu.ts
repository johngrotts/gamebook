import { Component } from '@angular/core';
import {RouterLink, Routes} from '@angular/router';
import {routes} from '../../../app.routes';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  imports: [
    MatMenuTrigger,
    MatMenu,
    RouterLink,
    MatIcon
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {

  protected routes: Routes = [];

  constructor() {
    this.routes = routes;
  }
}
