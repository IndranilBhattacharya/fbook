import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
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
      .getAllUsers()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((userList) => {
        this.listOfAllUsers = [...userList];
      });
  }

  deActivateUser(e: { userId: string }) {
    console.log(e?.userId);
  }
}
