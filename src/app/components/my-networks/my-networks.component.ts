import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from '../../interfaces/app-state';
import { UserDetail } from '../../interfaces/user-detail';
import { Friend } from '../../interfaces/friend';
import { FriendService } from '../../services/friend.service';

@Component({
  selector: 'app-my-networks',
  templateUrl: './my-networks.component.html',
  styleUrls: ['./my-networks.component.scss'],
})
export class MyNetworksComponent implements OnInit, AfterViewInit, OnDestroy {
  isDestroyed = new Subject();
  listOfAllUsers: Friend[] = [];
  lazyLoadedUsers: Friend[] = [];
  authInfo$!: Observable<UserDetail>;
  prevScrollTop: number = 0;
  lastLoadIndex: number = 20;

  constructor(
    private store: Store<AppState>,
    private _friendService: FriendService
  ) {}

  ngOnInit(): void {
    this.authInfo$ = this.store.select('auth');
    this.fetchAllUsers();
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
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((scrollInfo) => {
        if (
          scrollInfo.rootScrollTop > this.prevScrollTop &&
          this.lastLoadIndex <= this.listOfAllUsers?.length
        ) {
          const allUserArr = [...this.listOfAllUsers];
          this.lazyLoadedUsers = [
            ...this.lazyLoadedUsers,
            ...allUserArr.splice(
              this.lastLoadIndex,
              allUserArr?.length - this.lastLoadIndex > 10
                ? 10
                : allUserArr?.length
            ),
          ];
          this.lastLoadIndex += 10;
        }
        this.prevScrollTop = scrollInfo.rootScrollTop;
      });
  }

  fetchAllUsers() {
    this._friendService
      .getAllFriends('')
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((friendList) => {
        this.listOfAllUsers = friendList;
        this.lastLoadIndex = 20;
        this.lazyLoadedUsers = this.listOfAllUsers.splice(
          0,
          this.lastLoadIndex
        );
      });
  }

  onUpdateFriend(e: any) {
    console.log(e);
  }
}
