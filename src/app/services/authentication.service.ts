import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, takeWhile } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  updateUserNumFriends,
  updateUserNumPosts,
  updateUserPendingRequests,
} from '../core/actions/auth.actions';
import { AppState } from '../interfaces/app-state';
import { AuthUser } from '../interfaces/auth-user';
import { RegisterUser } from '../interfaces/register-user';
import { ResponseMsg } from '../interfaces/response-msg';
import { UserDetail } from '../interfaces/user-detail';
import { FriendService } from './friend.service';
import { PostService } from './post.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnDestroy {
  isSeriveAlive: boolean = true;

  constructor(
    private readonly _http: HttpClient,
    private readonly store: Store<AppState>,
    private readonly _postService: PostService,
    private readonly _friendService: FriendService
  ) {}

  ngOnDestroy(): void {
    this.isSeriveAlive = false;
  }

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

  updateUserPosts(_id: string) {
    this._postService
      .getMyNumOfPosts(_id)
      .pipe(takeWhile(() => this.isSeriveAlive))
      .subscribe((val) => this.store.dispatch(updateUserNumPosts({ val })));
  }

  updateUserFriends(_id: string) {
    this._friendService
      .getMyNumOfFriends(_id)
      .pipe(takeWhile(() => this.isSeriveAlive))
      .subscribe((val) => this.store.dispatch(updateUserNumFriends({ val })));
  }

  updateUserPendingRequests(_id: string) {
    this._friendService
      .getMyPendingRequests(_id)
      .pipe(takeWhile(() => this.isSeriveAlive))
      .subscribe((val) =>
        this.store.dispatch(updateUserPendingRequests({ val }))
      );
  }
}
