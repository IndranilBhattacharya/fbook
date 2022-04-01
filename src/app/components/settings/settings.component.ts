import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { UserDetail } from '../../interfaces/user-detail';
import { AppState } from '../../interfaces/app-state';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  isDestroyed = new Subject();
  defaultSettingsView: string = 'profile';
  authInfo$!: Observable<UserDetail>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authInfo$ = this.store.select('auth');
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
