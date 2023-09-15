import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '@core/layouts';

@Component({
  selector: 'admin-layout',
  standalone: true,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  imports: [CommonModule, RouterModule, AdminHeaderComponent],
})
export class AdminLayoutComponent {}
