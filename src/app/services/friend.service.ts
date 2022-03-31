import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateFriend } from '../interfaces/create-friend';
import { Friend } from '../interfaces/friend';
import { ResponseMsg } from '../interfaces/response-msg';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private readonly _http: HttpClient) {}

  getEntireFriendsList(): Observable<Friend[]> {
    const url = `${environment.serviceUrl}friends`;
    return this._http.get<Friend[]>(url);
  }

  getMyNumOfFriends(myId: string): Observable<number> {
    return this.getEntireFriendsList().pipe(
      map(
        (friendList) =>
          friendList?.filter(
            (f) =>
              f?.status?.includes('friend') &&
              !f?.status?.includes('unfriend') &&
              (f.userId === myId || f.friendId === myId)
          )?.length
      )
    );
  }

  getMyPendingRequests(myId: string): Observable<number> {
    return this.getEntireFriendsList().pipe(
      map(
        (friendList) =>
          friendList?.filter(
            (f) =>
              f?.status?.toLowerCase()?.includes('pending') &&
              (f.userId === myId || f.friendId === myId)
          )?.length
      )
    );
  }

  sendFriendRequest(payload: CreateFriend): Observable<ResponseMsg> {
    const url = `${environment.serviceUrl}friends/createrequest`;
    return this._http.post<ResponseMsg>(url, payload);
  }

  updateFriendRequest(
    requestId: string,
    payload: CreateFriend
  ): Observable<{}> {
    const url = `${environment.serviceUrl}friends/${requestId}`;
    return this._http.put<{}>(url, payload);
  }
}
