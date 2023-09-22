import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { HttpService } from '@app/core/http';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@app/core/authentication';
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private _httpService: HttpService,
    private _authenticationService: AuthenticationService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
