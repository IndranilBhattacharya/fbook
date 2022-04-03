import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDetail } from '../interfaces/user-detail';
import { UserIdPhotoId } from '../interfaces/user-id-photo-id';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(private readonly _http: HttpClient) {}

  getEntireUserList(): Observable<UserDetail[]> {
    const url = `${environment.serviceUrl}users`;
    return this._http.get<UserDetail[]>(url);
  }

  getAllUsers(): Observable<UserDetail[]> {
    return this.getEntireUserList().pipe(
      map((user) => user.filter((u) => u.isActive))
    );
  }

  getUserById(userId: string): Observable<UserDetail> {
    const url = `${environment.serviceUrl}users/${userId}`;
    return this._http.get<UserDetail>(url);
  }

  getUserByEmail(email: string): Observable<UserDetail> {
    const url = `${environment.serviceUrl}users/finduserbyemail`;
    return this._http
      .post<UserDetail[]>(url, { email })
      .pipe(
        map((users) => (users?.length > 0 ? users[0] : ({} as UserDetail)))
      );
  }

  updateUserPhotoId(payload: UserIdPhotoId): Observable<{}> {
    const url = `${environment.serviceUrl}users/updateuserphotoId`;
    return this._http.post<{}>(url, payload);
  }

  updateUserData(payload: UserDetail, userId: string) {
    const url = `${environment.serviceUrl}users/${userId}`;
    return this._http.put<{}>(url, payload);
  }
}
