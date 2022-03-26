import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUser } from '../interfaces/auth-user';
import { RegisterUser } from '../interfaces/register-user';
import { ResponseMsg } from '../interfaces/response-msg';
import { UserDetail } from '../interfaces/user-detail';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private readonly _http: HttpClient) {}

  authenticate(payload: AuthUser): Observable<UserDetail> {
    const url = `${environment.serviceUrl}users/authenticate`;
    return this._http.post<UserDetail>(url, payload);
  }

  register(payload: RegisterUser): Observable<ResponseMsg> {
    const url = `${environment.serviceUrl}users/register`;
    return this._http.post<ResponseMsg>(url, payload);
  }

  resetPassword(userId: string, password: string): Observable<{}> {
    const url = `${environment.serviceUrl}users/${userId}`;
    return this._http.put<{}>(url, { password });
  }
}
