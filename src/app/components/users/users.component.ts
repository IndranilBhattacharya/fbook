import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastService } from 'angular-toastify';
import { UserDataService } from '../../services/user-data.service';
import { UserDetail } from '../../interfaces/user-detail';
import { AppState } from '../../interfaces/app-state';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  listOfAllUsers: UserDetail[] = [];
  authInfo$!: Observable<UserDetail>;
  isDestroyed = new Subject();

  constructor(
    private store: Store<AppState>,
    private _toastService: ToastService,
    private _userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.authInfo$ = this.store.select('auth');
    this.fetchAllUsers();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  fetchAllUsers() {
    this._userDataService
      .getEntireUserList()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((userList) => {
        this.listOfAllUsers = [...userList];
      });
  }

  deActivateUser(e: { userId: string; isActive: boolean }) {
    this._userDataService
      .updateUserData({ isActive: e.isActive } as UserDetail, e.userId)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this._toastService.default(
          `User has been ${e.isActive ? 'enabled' : 'disabled'}`
        );
        this.fetchAllUsers();
      });
  }
}
