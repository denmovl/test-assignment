import { Country } from '../enum/country';

export interface User {
  country: Country | null;
  userName: string | null;
  birthDay: string | null;
}
