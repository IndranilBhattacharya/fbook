import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { panIn } from 'src/app/animations/pan-in.animation';
import { panOut } from 'src/app/animations/pan-out.animation';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [panIn, panOut],
})
export class ResetPasswordComponent {
  isAlive: boolean = true;
  is1stStepSubmitted: boolean = false;
  is2ndStepSubmitted: boolean = false;
  isVerified: boolean = false;
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
    this.is1stStepSubmitted = true;
    this.isVerified = true;
  }

  onPasswordReset() {
    this.is2ndStepSubmitted = true;
    //this.router.navigateByUrl('/auth/login');
  }
}
