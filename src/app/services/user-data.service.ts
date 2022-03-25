import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterUser } from '../interfaces/register-user';
import { ResponseMsg } from '../interfaces/response-msg';
import { UserDetail } from '../interfaces/user-detail';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(private readonly _http: HttpClient) {}

  getUserByEmail(email: string): Observable<UserDetail> {
    const url = `${environment.serviceUrl}users/finduserbyemail`;
    return this._http
      .post<UserDetail[]>(url, { email })
      .pipe(
        map((users) => (users?.length > 0 ? users[0] : ({} as UserDetail)))
      );
  }
}
