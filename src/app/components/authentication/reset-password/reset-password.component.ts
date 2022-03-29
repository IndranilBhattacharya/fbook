import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { catchError, Subject, takeUntil, takeWhile } from 'rxjs';
import { panIn } from '../../../animations/pan-in.animation';
import { panOut } from '../../../animations/pan-out.animation';
import { UserDetail } from '../../../interfaces/user-detail';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [panIn, panOut],
})
export class ResetPasswordComponent {
  isDestroyed = new Subject();
  is1stStepSubmitted: boolean = false;
  is2ndStepSubmitted: boolean = false;
  isVerified: boolean = false;
  showVerificationSpinner: boolean = false;
  showResetSpinner: boolean = false;
  maxDob: Date = new Date();
  userId: string = '';

  verificationGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    dob: ['', Validators.required],
  });
  passwordGroup: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private _toastService: ToastService,
    private _userDataService: UserDataService,
    private _authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.maxDob.setFullYear(this.maxDob.getFullYear() - 18);
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  get verificationGroupControls() {
    return this.verificationGroup.controls;
  }

  get passwordGroupControls() {
    return this.passwordGroup.controls;
  }

  onVerify() {
    this.is1stStepSubmitted = true;
    if (this.verificationGroup.status === 'VALID') {
      this.showVerificationSpinner = true;
      this._userDataService
        .getUserByEmail(this.verificationGroupControls['email'].value)
        .pipe(
          takeUntil(this.isDestroyed),
          catchError((err) => {
            this.showVerificationSpinner = false;
            throw err;
          })
        )
        .subscribe((userData: UserDetail) => {
          this.showVerificationSpinner = false;
          if (!userData?.email) {
            this.isVerified = false;
            this.verificationGroupControls['email'].setErrors({
              invalidEmail: true,
            });
          } else if (
            this.verificationGroupControls['dob'].value ===
            this.datePipe.transform(userData.dob, 'yyyy-MM-dd')
          ) {
            this.isVerified = true;
            this.userId = userData.id;
          } else {
            this.isVerified = false;
            this.verificationGroupControls['dob'].setErrors({
              invalidDob: true,
            });
          }
        });
    }
  }

  onPasswordReset() {
    this.is2ndStepSubmitted = true;
    if (
      this.passwordGroup.status === 'VALID' &&
      this.userId &&
      !this.showResetSpinner
    ) {
      this.showResetSpinner = true;
      this._authService
        .resetPassword(
          this.userId,
          this.passwordGroupControls['password'].value
        )
        .pipe(
          takeUntil(this.isDestroyed),
          catchError((err) => {
            this.showResetSpinner = false;
            throw err;
          })
        )
        .subscribe(() => {
          this.showResetSpinner = false;
          this._toastService.success('Password reset successfully! 👍');
          this.router.navigateByUrl('/auth/login');
        });
    }
  }
}
