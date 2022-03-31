import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastService } from 'angular-toastify';
import { Subject, takeUntil } from 'rxjs';
import { userId } from '../../core/selectors/user-info.selector';
import { AppState } from '../../interfaces/app-state';
import { CreateFriend } from '../../interfaces/create-friend';
import { Friend } from '../../interfaces/friend';
import { UserDetail } from '../../interfaces/user-detail';
import { AuthenticationService } from '../../services/authentication.service';
import { FriendService } from '../../services/friend.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss'],
})
export class MyFriendsComponent implements OnInit, OnDestroy {
  isDestroyed = new Subject();
  listOfFriends: Friend[] | null = [];
  listOfAllUsers: UserDetail[] = [];
  friendListAccepted: Friend[] = [];
  friendListForMyRequest: string[] = [];
  friendListForPendingRequest: string[] = [];
  loggedInUserId: string = '';

  constructor(
    private store: Store<AppState>,
    private _authService: AuthenticationService,
    private _toastService: ToastService,
    private _userData: UserDataService,
    private _friendService: FriendService
  ) {}

  ngOnInit(): void {
    this.store
      .select(userId)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((_id) => {
        this.loggedInUserId = _id;
        this.fetchFriendsOfUser();
        this.fetchAllUsers();
      });
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  fetchAllUsers() {
    this._userData
      .getAllUsers()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((userList) => {
        this.listOfAllUsers = [
          ...userList.filter((u) => u._id !== this.loggedInUserId),
        ];
      });
  }

  fetchFriendsOfUser() {
    this._friendService
      .getEntireFriendsList()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((friendList) => {
        this.listOfFriends = friendList?.length > 0 ? [...friendList] : null;
        this.friendListForMyRequest = [
          ...friendList
            ?.filter(
              (friend) =>
                friend?.status?.toLowerCase()?.includes('pending') &&
                friend?.userId === this.loggedInUserId
            )
            ?.map((f) => f.friendId),
        ];
        this.friendListForPendingRequest = [
          ...friendList
            ?.filter(
              (friend) =>
                friend?.status?.toLowerCase()?.includes('pending') &&
                friend?.friendId === this.loggedInUserId
            )
            ?.map((f) => f.userId),
        ];
        this.friendListAccepted = [
          ...friendList?.filter(
            (friend) =>
              friend?.status?.toLowerCase()?.includes('friend') &&
              !friend?.status?.toLowerCase()?.includes('unfriend') &&
              (friend?.friendId === this.loggedInUserId ||
                friend?.userId === this.loggedInUserId)
          ),
        ];
      });
  }

  onUpdateFriend(e: {
    userInfo: UserDetail;
    targetStatus: string;
    requestId: string;
  }) {
    let updateFriendPayload = {
      userId:
        e?.targetStatus === 'Cancelled Request'
          ? this.loggedInUserId
          : e?.userInfo?._id,
      friendId:
        e?.targetStatus === 'Cancelled Request'
          ? e?.userInfo?._id
          : this.loggedInUserId,
      status: e?.targetStatus,
    } as CreateFriend;
    this._friendService
      .updateFriendRequest(e?.requestId, updateFriendPayload)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this._toastService.default('Status has been updated 📜');
        this.fetchFriendsOfUser();
        this.fetchAllUsers();
        this._authService.updateUserPendingRequests(this.loggedInUserId);
        this._authService.updateUserFriends(this.loggedInUserId);
      });
  }
}
