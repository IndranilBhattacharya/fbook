import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterUser } from '../interfaces/register-user';
import { ResponseMsg } from '../interfaces/response-msg';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private readonly _http: HttpClient) {}

  authenticate(payload: RegisterUser): Observable<ResponseMsg> {
    const url = `${environment.serviceUrl}users/register`;
    return this._http.post<ResponseMsg>(url, payload);
  }

  register(payload: RegisterUser): Observable<ResponseMsg> {
    const url = `${environment.serviceUrl}users/register`;
    return this._http.post<ResponseMsg>(url, payload);
  }

  resetPassword(payload: RegisterUser): Observable<ResponseMsg> {
    const url = `${environment.serviceUrl}users/register`;
    return this._http.post<ResponseMsg>(url, payload);
  }
}
