import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, map, Observable } from 'rxjs';
import { AppState } from '../interfaces/app-state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private store: Store<AppState>) {}

  canActivate(): Observable<boolean> {
    return this.store.select('auth').pipe(
      map((userDetail) => {
        const { isAdmin } = userDetail;
        if (!isAdmin) {
          this.router.navigateByUrl('/');
        }
        return isAdmin;
      }),
      catchError((err) => {
        this.router.navigateByUrl('/');
        throw err;
      })
    );
  }
}
