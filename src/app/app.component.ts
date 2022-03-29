import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalStorage } from 'ngx-webstorage';
import { Observable, Subject, takeUntil } from 'rxjs';
import { updateUserData } from './core/actions/auth.actions';
import {
  toastautoClose,
  toastcloseOnClick,
  toasthideProgressBar,
  toasticonLibrary,
  toastnewestOnTop,
  toastpauseOnHover,
  toastpauseOnVisibilityChange,
  toastposition,
  toasttransition,
} from './core/selectors/toast-param.selector';
import { AppState } from './interfaces/app-state';
import { AuthenticationService } from './services/authentication.service';
import { UserDataService } from './services/user-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @LocalStorage()
  userId!: string;

  isDestroyed = new Subject();
  toastposition$!: Observable<
    'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
  >;
  toasttransition$!: Observable<'bounce' | 'slide' | 'zoom' | 'flip'>;
  toastautoClose$!: Observable<number>;
  toasthideProgressBar$!: Observable<boolean>;
  toastnewestOnTop$!: Observable<boolean>;
  toastcloseOnClick$!: Observable<boolean>;
  toastpauseOnHover$!: Observable<boolean>;
  toastpauseOnVisibilityChange$!: Observable<boolean>;
  toasticonLibrary$!: Observable<'material' | 'font-awesome' | 'none'>;

  constructor(
    public location: Location,
    private store: Store<AppState>,
    private _userDataService: UserDataService,
    private _authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.fetchToastConfig();
    this.fetchUserDetail();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  fetchToastConfig() {
    this.toastposition$ = this.store.select(toastposition);
    this.toasttransition$ = this.store.select(toasttransition);
    this.toastautoClose$ = this.store.select(toastautoClose);
    this.toasthideProgressBar$ = this.store.select(toasthideProgressBar);
    this.toastnewestOnTop$ = this.store.select(toastnewestOnTop);
    this.toastcloseOnClick$ = this.store.select(toastcloseOnClick);
    this.toastpauseOnHover$ = this.store.select(toastpauseOnHover);
    this.toastpauseOnVisibilityChange$ = this.store.select(
      toastpauseOnVisibilityChange
    );
    this.toasticonLibrary$ = this.store.select(toasticonLibrary);
  }

  fetchUserDetail() {
    this._userDataService
      .getUserById(this.userId)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((userDetail) => {
        this.store.dispatch(updateUserData({ val: userDetail }));
        this._authService.updateUserPosts(userDetail._id);
        this._authService.updateUserFriends(userDetail._id);
      });
  }
}
