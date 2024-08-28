import { UsersService } from '../services/users.service';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

export const userNameValidator = (usersService: UsersService): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return usersService.checkUserName(control.value).pipe(
      map(({ isAvailable }) => (isAvailable ? null : { invalid: true })),
      catchError(() => of({ invalid: true })),
    );
  };
};
