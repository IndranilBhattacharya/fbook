import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, throttleTime } from 'rxjs';
import { ToastService } from 'angular-toastify';
import { AppState } from '../../interfaces/app-state';
import { UserDetail } from '../../interfaces/user-detail';
import { Friend } from '../../interfaces/friend';
import { FriendService } from '../../services/friend.service';
import { UserDataService } from '../../services/user-data.service';
import { userId } from '../../core/selectors/user-info.selector';
import { CreateFriend } from '../../interfaces/create-friend';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-my-networks',
  templateUrl: './my-networks.component.html',
  styleUrls: ['./my-networks.component.scss'],
})
export class MyNetworksComponent implements OnInit, AfterViewInit, OnDestroy {
  isDestroyed = new Subject();
  listOfFriends: Friend[] = [];
  listOfAllUsers: UserDetail[] = [];
  lazyLoadedUsers: UserDetail[] = [];
  loggedInUserId: string = '';
  prevScrollTop: number = 0;
  lastLoadIndex: number = 20;

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

  ngAfterViewInit(): void {
    this.observerRootScroll();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  observerRootScroll() {
    this.store
      .select('rootScrollTop')
      .pipe(takeUntil(this.isDestroyed), throttleTime(700))
      .subscribe((scrollInfo) => {
        if (
          scrollInfo.rootScrollTop > this.prevScrollTop &&
          this.lastLoadIndex < this.listOfAllUsers?.length
        ) {
          const allUserArr = [...this.listOfAllUsers];
          const allUserCount = allUserArr?.length;
          this.lazyLoadedUsers = [
            ...this.lazyLoadedUsers,
            ...allUserArr.splice(
              this.lastLoadIndex,
              allUserCount - this.lastLoadIndex > 10 ? 10 : allUserCount
            ),
          ];
          this.lastLoadIndex =
            allUserCount - this.lastLoadIndex > 10
              ? this.lastLoadIndex + 10
              : allUserCount;
          this.prevScrollTop = scrollInfo.rootScrollTop;
        }
      });
  }

  fetchAllUsers() {
    this._userData
      .getAllUsers()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((userList) => {
        this.listOfAllUsers = [
          ...userList.filter((u) => u._id !== this.loggedInUserId),
        ];
        this.lastLoadIndex = 20;
        const tempAllUserList = [...this.listOfAllUsers];
        this.lazyLoadedUsers = tempAllUserList.splice(0, this.lastLoadIndex);
      });
  }

  fetchFriendsOfUser() {
    this._friendService
      .getAllFriends(this.loggedInUserId)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((friendList) => {
        this.listOfFriends = [...friendList];
      });
  }

  onUpdateFriend(e: { userInfo: UserDetail; targetStatus: string }) {
    const createFriendPayload = {
      userId: this.loggedInUserId,
      friendId: e.userInfo._id,
      status: e?.targetStatus,
    } as CreateFriend;
    this._friendService
      .sendFriendRequest(createFriendPayload)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((msg) => {
        if (msg.message?.toLowerCase()?.includes('success')) {
          this._toastService.default('Friend request sent! 🤝🏻');
          this.fetchFriendsOfUser();
          this.fetchAllUsers();
          this._authService.updateUserPendingRequests(this.loggedInUserId);
        }
      });
  }
}
