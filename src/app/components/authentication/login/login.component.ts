import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { catchError, takeWhile } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  isAlive: boolean = true;
  isSubmitted: boolean = false;
  showAuthSpinner: boolean = false;
  authenticationGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private router: Router,
    private _toastService: ToastService,
    private formBuilder: FormBuilder,
    private _authService: AuthenticationService
  ) {}

  get authenticationGroupControls() {
    return this.authenticationGroup.controls;
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  onAuthenticate() {
    this.isSubmitted = true;
    if (this.authenticationGroup.status === 'VALID') {
      this.showAuthSpinner = true;
      this._authService
        .authenticate(this.authenticationGroup.value)
        .pipe(
          takeWhile(() => this.isAlive),
          catchError((err) => {
            this.showAuthSpinner = false;
            this.showInvalidToast();
            throw err;
          })
        )
        .subscribe((userInformation) => {
          this.showAuthSpinner = false;
          if (userInformation?.token) {
            localStorage.setItem('auth', userInformation.token);
            this.router.navigateByUrl('/');
          } else {
            this.showInvalidToast();
          }
        });
    }
  }

  onRegister() {
    this.router.navigateByUrl('/auth/register');
  }

  showInvalidToast() {
    this._toastService.error('Invalid email or password');
  }
}
