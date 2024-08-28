import { FormControl } from '@angular/forms';
import { Country } from '../enum/country';

export interface UserForm {
  country: FormControl<Country | null>;
  userName: FormControl<string | null>;
  birthDay: FormControl<string | null>;
}
