import { Directive, Input } from '@angular/core';
import { FormGroup, NG_VALIDATORS } from '@angular/forms';
import { equalValidator } from './equal-validator.function';

@Directive({
  selector: '[equalValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EqualValidatorDirective,
      multi: true,
    },
  ],
})
export class EqualValidatorDirective {
  @Input('equalValidator') mustMatch: string[];

  constructor() {
    this.mustMatch = [];
  }

  validate(formGroup: FormGroup) {
    return equalValidator(this.mustMatch)(formGroup);
  }
}
