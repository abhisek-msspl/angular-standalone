import {
  OnInit,
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { HttpService } from '@app/core/http';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@app/core/authentication';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private _httpService: HttpService,
    private _authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  initializeLoginForm() {
    this.subscriptions.push(
      this._httpService
        .post('auth/login', {
          user_email: 'joyanta.sarkar@mailinator.com',
          password: 'superadmin',
          remember: true,
          browser_id: 'Chrome/116.0.0.0',
          browser_name:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          ip_address: '182.72.211.50',
          device_id: '',
          device_token: '',
          device_name: '',
          device_version: '',
          session_id: '',
          api_version: 'v1',
          client_name: 'Web',
          app_version: '',
          client_secret_id: '41ca4470-48b6-4d49-9a60-0982cbf00291',
        })
        .subscribe({
          next: apiResult => {
            console.log(apiResult);
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
