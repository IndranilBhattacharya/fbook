import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  isAlive: boolean = true;
  isSubmitted: boolean = false;
  registrationGroup: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    email: ['', [Validators.required, Validators.email]],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  get registrationGroupControls() {
    return this.registrationGroup.controls;
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  onRegister() {
    this.isSubmitted = true;
    //this.router.navigateByUrl('/auth/login');
  }
}
