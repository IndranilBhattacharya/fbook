import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastService } from 'angular-toastify';
import { takeWhile } from 'rxjs';
import { position } from 'src/app/core/actions/toast.actions';
import { AppState } from 'src/app/interfaces/app-state';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { ResponseMsg } from 'src/app/interfaces/response-msg';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  isAlive: boolean = true;
  isSubmitted: boolean = false;
  showSpinner: boolean = false;

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
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private _toastService: ToastService,
    private _authService: AuthenticationService
  ) {}

  get registrationGroupControls() {
    return this.registrationGroup.controls;
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  onRegister() {
    this.isSubmitted = true;
    if (this.registrationGroup.status === 'VALID') {
      this.showSpinner = true;
      this._authService
        .register(this.registrationGroup.value as RegisterUser)
        .pipe(takeWhile(() => this.isAlive))
        .subscribe((resMsg: ResponseMsg) => {
          this.showSpinner = false;
          if (resMsg.message?.includes('success')) {
            this.store.dispatch(position({ val: 'top-right' }));
            this._toastService.default('User registered successfully! 🥳');
            this.router.navigateByUrl('/auth/login');
          }
        });
    }
  }
}
