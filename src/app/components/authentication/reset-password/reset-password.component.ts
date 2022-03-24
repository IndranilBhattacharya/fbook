import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  isAlive: boolean = true;
  isSubmitted: boolean = false;
  verificationGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    dob: ['', Validators.required],
  });

  passwordGroup: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  get verificationGroupControls() {
    return this.verificationGroup.controls;
  }

  get passwordGroupControls() {
    return this.passwordGroup.controls;
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  onVerify() {
    this.isSubmitted = true;
    //this.router.navigateByUrl('/auth/login');
  }
}
