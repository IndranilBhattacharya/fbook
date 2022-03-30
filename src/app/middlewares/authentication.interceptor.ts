import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, filter, Observable, of, Subject, takeUntil } from 'rxjs';
import { LocalStorage } from 'ngx-webstorage';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../interfaces/app-state';
import { updateUserData } from '../core/actions/auth.actions';
import { UserDetail } from '../interfaces/user-detail';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor, OnDestroy {
  @LocalStorage()
  authToken!: string;
  isDestroyed = new Subject();
  activeRoute: string = '';

  constructor(private router: Router, private store: Store<AppState>) {
    this.checkCurrentUrl();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  checkCurrentUrl() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.isDestroyed)
      )
      .subscribe((e: any) => (this.activeRoute = e.url));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.authToken && !this.activeRoute.includes('auth')) {
      this.router.navigateByUrl('/auth');
    }

    request = request.clone({
      setHeaders: { Authorization: `Bearer ${this.authToken}` },
    });
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          this.store.dispatch(
            updateUserData({ val: { _id: 'unauthorized' } as UserDetail })
          );
          if (err.status === 401 || err.status === 403) {
            this.router.navigateByUrl('/auth');
          }
        }
        return of(err);
      })
    );
  }
}
