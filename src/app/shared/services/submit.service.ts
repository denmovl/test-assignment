import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmitFormResponseData } from '../interface/responses';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SubmitService {
  #http = inject(HttpClient);

  send(userSubmissions: User[]): Observable<SubmitFormResponseData> {
    return this.#http.post<SubmitFormResponseData>('/api/submitForm', userSubmissions);
  }
}
