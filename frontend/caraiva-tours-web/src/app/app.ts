import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActionNotification } from './shared/components/action-notification/action-notification';

@Component({
  selector: 'app-root',
  imports: [ActionNotification, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
