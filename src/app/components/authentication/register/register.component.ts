import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastService } from 'angular-toastify';
import { catchError, takeWhile } from 'rxjs';
import { position } from '../../../core/actions/toast.actions';
import { AppState } from '../../../interfaces/app-state';
import { RegisterUser } from '../../../interfaces/register-user';
import { ResponseMsg } from '../../../interfaces/response-msg';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  isAlive: boolean = true;
  isSubmitted: boolean = false;
  showSpinner: boolean = false;
  maxDob: Date = new Date();

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
    private _toastService: ToastService,
    private _authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.maxDob.setFullYear(this.maxDob.getFullYear() - 18);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  get registrationGroupControls() {
    return this.registrationGroup.controls;
  }

  onRegister() {
    this.isSubmitted = true;
    if (this.registrationGroup.status === 'VALID') {
      this.showSpinner = true;
      this._authService
        .register(this.registrationGroup.value as RegisterUser)
        .pipe(
          takeWhile(() => this.isAlive),
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
