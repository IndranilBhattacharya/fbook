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

  getAllFriends(id: string): Observable<Friend[]> {
    return this.getEntireFriendsList().pipe(
      map((friendRequest) => friendRequest.filter((req) => req.userId === id))
    );
  }

  getMyNumOfFriends(myId: string): Observable<number> {
    return this.getAllFriends(myId).pipe(
      map(
        (friendList) =>
          friendList?.filter((f) => f?.status?.includes('friend'))?.length
      )
    );
  }

  getMyPendingRequests(myId: string): Observable<number> {
    return this.getAllFriends(myId).pipe(
      map(
        (friendList) =>
          friendList?.filter((f) =>
            f?.status?.toLowerCase()?.includes('pending')
          )?.length
      )
    );
  }

  sendFriendRequest(payload: CreateFriend): Observable<ResponseMsg> {
    const url = `${environment.serviceUrl}friends/createrequest`;
    return this._http.post<ResponseMsg>(url, payload);
  }
}
