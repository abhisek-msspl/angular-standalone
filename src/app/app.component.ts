import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-standalone'; // app title
  private subscriptions: Subscription[] = [];

  constructor() {
    console.log(environment.production);
  }

  ngOnInit(): void {
    console.log(`${this.title} app initialized`);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
