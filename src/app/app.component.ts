import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalStorage } from 'ngx-webstorage';
import { Observable, Subject, takeUntil } from 'rxjs';
import { updateUserData } from './core/actions/auth.actions';
import { updateScrollTop } from './core/actions/root-scroll.actions';
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
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private renderer: Renderer2,
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

  ngAfterViewInit(): void {
    this.fetchScrollPosition();
  }

  fetchScrollPosition() {
    const rootElemQuery = document.getElementsByTagName('app-root');
    if (rootElemQuery?.length > 0) {
      const renderedRoot = this.renderer.selectRootElement(
        rootElemQuery[0],
        true
      );
      this.renderer.listen(renderedRoot, 'scroll', (e) =>
        this.store.dispatch(updateScrollTop({ val: e?.target?.scrollTop }))
      );
    }
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
