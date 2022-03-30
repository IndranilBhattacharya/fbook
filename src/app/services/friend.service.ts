import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Friend } from '../interfaces/friend';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private readonly _http: HttpClient) {}

  getAllFriends(id: string): Observable<Friend[]> {
    const url = `${environment.serviceUrl}friends/${id}`;
    return this._http.get<Friend[]>(url);
  }

  getMyNumOfFriends(myId: string): Observable<number> {
    return this.getAllFriends('').pipe(
      map(
        (friendList) =>
          friendList?.filter(
            (f) => f._id === myId && f.status.includes('friend')
          )?.length
      )
    );
  }
}
