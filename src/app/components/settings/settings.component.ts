import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, takeWhile } from 'rxjs';
import { ToastService } from 'angular-toastify';
import { UserDetail } from '../../interfaces/user-detail';
import { AppState } from '../../interfaces/app-state';
import { AuthenticationService } from '../../services/authentication.service';
import { userId } from '../../core/selectors/user-info.selector';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  isAlive: boolean = true;
  isPassResetSubmitted: boolean = false;
  showResetPassSpinner: boolean = false;
  defaultSettingsView: string = 'profile';
  authInfo$!: Observable<UserDetail>;
  userId: string = '';

  passwordGroup: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private _toastService: ToastService,
    private _authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authInfo$ = this.store.select('auth');
    this.store
      .select(userId)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((id) => (this.userId = id));
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  get passwordGroupControls() {
    return this.passwordGroup.controls;
  }

  onPasswordReset() {
    this.isPassResetSubmitted = true;
    if (
      this.passwordGroup.status === 'VALID' &&
      this.userId &&
      !this.showResetPassSpinner
    ) {
      this.showResetPassSpinner = true;
      this._authService
        .resetPassword(
          this.userId,
          this.passwordGroupControls['password'].value
        )
        .pipe(
          takeWhile(() => this.isAlive),
          catchError((err) => {
            this.showResetPassSpinner = false;
            throw err;
          })
        )
        .subscribe(() => {
          this.showResetPassSpinner = false;
          this._toastService.success('Password changed successfully! 👍');
        });
    }
  }
}
