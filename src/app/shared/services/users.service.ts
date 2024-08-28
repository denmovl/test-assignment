import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckUserResponseData } from '../interface/responses';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  #http = inject(HttpClient);

  checkUserName(username: string): Observable<CheckUserResponseData> {
    return this.#http.post<CheckUserResponseData>('/api/checkUsername', { username });
  }
}
