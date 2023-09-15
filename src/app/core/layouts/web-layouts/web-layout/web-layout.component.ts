import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebHeaderComponent } from '@core/layouts';

@Component({
  selector: 'web-layout',
  standalone: true,
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.scss'],
  imports: [CommonModule, RouterModule, WebHeaderComponent],
})
export class WebLayoutComponent {}
