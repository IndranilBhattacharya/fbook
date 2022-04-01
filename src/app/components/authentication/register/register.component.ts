import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { catchError, Subject, takeUntil } from 'rxjs';
import { UserDetail } from '../../../interfaces/user-detail';
import { RegisterUser } from '../../../interfaces/register-user';
import { ResponseMsg } from '../../../interfaces/response-msg';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  isDestroyed = new Subject();
  isSubmitted: boolean = false;
  showSpinner: boolean = false;
  showSaveSpinner: boolean = false;
  maxDob: Date = new Date();
  @Input() userProfileData!: UserDetail | null | any;

  registrationGroup: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    email: ['', [Validators.required, Validators.email]],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private _toastService: ToastService,
    private _authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.maxDob.setFullYear(this.maxDob.getFullYear() - 18);
    this.userProfileData && this.fetchUserInformation();
  }

  fetchUserInformation() {
    this.registrationGroupControls['firstName'].setValue(
      this.userProfileData?.firstName ?? ''
    );
    this.registrationGroupControls['lastName'].setValue(
      this.userProfileData?.firstName ?? ''
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
    this.registrationGroupControls['password'].setValue(
      this.userProfileData?.password ?? ''
    );
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  get registrationGroupControls() {
    return this.registrationGroup.controls;
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
}
