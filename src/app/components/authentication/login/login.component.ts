import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  isAlive: boolean = true;
  isSubmitted: boolean = false;
  authenticationGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  get authenticationGroupControls() {
    return this.authenticationGroup.controls;
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  onAuthenticate() {
    this.isSubmitted = true;
  }

  onRegister() {
    this.router.navigateByUrl('/auth/register');
  }
}
