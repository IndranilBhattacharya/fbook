import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { resetUserData } from 'src/app/core/actions/auth.actions';
import { UserDetail } from 'src/app/interfaces/user-detail';
import { numOfPendingRequest } from '../../core/selectors/user-info.selector';
import { AppState } from '../../interfaces/app-state';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent implements OnInit {
  authInfo$!: Observable<UserDetail>;
  numOfPendingRequests$!: Observable<number>;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.authInfo$ = this.store.select('auth');
    this.numOfPendingRequests$ = this.store.select(numOfPendingRequest);
  }

  onHomeClick() {
    this.router.navigateByUrl('');
  }

  onLogOut() {
    this._localStorageService.clear('authToken');
    this._localStorageService.clear('userId');
    this.store.dispatch(resetUserData());
    this.router.navigateByUrl('/auth');
  }
}
