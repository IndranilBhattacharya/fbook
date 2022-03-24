import { FormGroup } from '@angular/forms';

export const equalValidator = (controls: string[]) => {
  const [controlName, matchingControlName] = controls;
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ mismatch: true });
    } else {
      matchingControl?.setErrors(null);
    }
    return null;
  };
};
