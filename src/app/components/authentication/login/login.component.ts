import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastService } from 'angular-toastify';
import { LocalStorageService, SessionStorage } from 'ngx-webstorage';
import { catchError, Subject, takeUntil } from 'rxjs';
import { updateUserData } from '../../../core/actions/auth.actions';
import { AppState } from '../../../interfaces/app-state';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  @SessionStorage()
  lastLocation!: string;
  isDestroyed = new Subject();
  isSubmitted: boolean = false;
  showAuthSpinner: boolean = false;
  authenticationGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private _toastService: ToastService,
    private _localStorageService: LocalStorageService,
    private _authService: AuthenticationService
  ) {}

  get authenticationGroupControls() {
    return this.authenticationGroup.controls;
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  onAuthenticate() {
    this.isSubmitted = true;
    if (this.authenticationGroup.status === 'VALID' && !this.showAuthSpinner) {
      this.showAuthSpinner = true;
      this._authService
        .authenticate(this.authenticationGroup.value)
        .pipe(
          takeUntil(this.isDestroyed),
          catchError((err) => {
            this.showAuthSpinner = false;
            this.showInvalidToast();
            throw err;
          })
        )
        .subscribe((userInformation) => {
          this.showAuthSpinner = false;
          if (userInformation?.token) {
            this._localStorageService.store(
              'authToken',
              userInformation?.token
            );
            this._localStorageService.store('userId', userInformation?._id);
            this.store.dispatch(updateUserData({ val: userInformation }));
            this._authService.updateUserPosts(userInformation?._id);
            this._authService.updateUserFriends(userInformation?._id);
            this._authService.updateUserPendingRequests(userInformation?._id);
            this.router.navigateByUrl(
              !this.lastLocation ? '/' : this.lastLocation
            );
          } else {
            this.showInvalidToast();
          }
        });
      setInterval(() => (this.showAuthSpinner = false), 5000);
    }
  }

  onRegister() {
    this.router.navigateByUrl('/auth/register');
  }

  showInvalidToast() {
    this._toastService.error('Invalid email or password');
  }
}
