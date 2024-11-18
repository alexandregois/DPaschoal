import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmedValidator(matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const matchingControl = control.parent?.get(matchingControlName);

    if (!control?.value || !matchingControl?.value || matchingControl?.errors) {
      return null;
    }
    return control!.value !== matchingControl!.value
      ? { confirmedValidator: true }
      : null;
  };
}
