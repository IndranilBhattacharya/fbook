import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastService } from 'angular-toastify';
import { catchError, Subject, takeUntil, takeWhile } from 'rxjs';
import { UserDetail } from '../../../interfaces/user-detail';
import { RegisterUser } from '../../../interfaces/register-user';
import { ResponseMsg } from '../../../interfaces/response-msg';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserDataService } from '../../../services/user-data.service';
import { AppState } from '../../../interfaces/app-state';
import { updateUserData } from '../../../core/actions/auth.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  isDestroyed = new Subject();
  isAlive: boolean = true;
  isSubmitted: boolean = false;
  showSpinner: boolean = false;
  showSaveSpinner: boolean = false;
  maxDob: Date = new Date();
  @Input() userProfileData!: UserDetail | null;

  registrationGroup: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    email: ['', [Validators.required, Validators.email]],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    profession: [''],
    country: [''],
    city: [''],
    password: [''],
  });

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private _toastService: ToastService,
    private _authService: AuthenticationService,
    private _userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.maxDob.setFullYear(this.maxDob.getFullYear() - 18);
    this.userProfileData && this.fetchUserInformation();
    !this.userProfileData && this.setPasswordValidators();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
    this.isAlive = false;
  }

  get registrationGroupControls() {
    return this.registrationGroup.controls;
  }

  fetchUserInformation() {
    this.registrationGroupControls['firstName'].setValue(
      this.userProfileData?.firstName ?? ''
    );
    this.registrationGroupControls['lastName'].setValue(
      this.userProfileData?.lastName ?? ''
    );
    this.registrationGroupControls['email'].setValue(
      this.userProfileData?.email ?? ''
    );
    this.registrationGroupControls['dob'].setValue(
      this.datePipe.transform(this.userProfileData?.dob, 'yyyy-MM-dd') ?? ''
    );
    this.registrationGroupControls['gender'].setValue(
      this.userProfileData?.gender ?? ''
    );
    this.registrationGroupControls['city'].setValue(
      this.userProfileData?.city ?? ''
    );
    this.registrationGroupControls['country'].setValue(
      this.userProfileData?.country ?? ''
    );
    this.registrationGroupControls['profession'].setValue(
      this.userProfileData?.profession ?? ''
    );
  }

  setPasswordValidators() {
    this.registrationGroupControls['password'].addValidators([
      Validators.required,
      Validators.minLength(6),
    ]);
  }

  onRegister() {
    this.isSubmitted = true;
    if (this.registrationGroup.status === 'VALID' && !this.showSpinner) {
      this.showSpinner = true;
      this._authService
        .register(this.registrationGroup.value as RegisterUser)
        .pipe(
          takeUntil(this.isDestroyed),
          catchError((err) => {
            this.showSpinner = false;
            throw err;
          })
        )
        .subscribe((resMsg: ResponseMsg) => {
          this.showSpinner = false;
          if (resMsg.message?.includes('success')) {
            this._toastService.default('User registered successfully! 🥳');
            this.router.navigateByUrl('/auth/login');
          }
        });
    }
  }

  onSave() {
    if (
      this.registrationGroup.status === 'VALID' &&
      !this.showSaveSpinner &&
      this.userProfileData
    ) {
      console.log(this.registrationGroup.value);
      const profilePayload = { ...this.registrationGroup.value };
      delete profilePayload.password;
      this.showSaveSpinner = true;
      this._userDataService
        .updateUserData(profilePayload as UserDetail, this.userProfileData?._id)
        .pipe(
          takeUntil(this.isDestroyed),
          catchError((err) => {
            this.showSaveSpinner = false;
            throw err;
          })
        )
        .subscribe(() => {
          this.showSaveSpinner = false;
          this.fetchUserDetail();
          this._toastService.default('Profile updated 👍🏻');
        });
    }
  }

  fetchUserDetail() {
    this.userProfileData?._id &&
      this._userDataService
        .getUserById(this.userProfileData?._id)
        .pipe(takeWhile(() => this.isAlive))
        .subscribe((userDetail) => {
          this.store.dispatch(updateUserData({ val: userDetail }));
        });
  }
}
