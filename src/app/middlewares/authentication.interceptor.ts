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

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor, OnDestroy {
  @LocalStorage()
  authToken!: string;
  isDestroyed = new Subject();
  activeRoute: string = '';

  constructor(private router: Router) {
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
          if (~~(err.status / 400) === 1) {
            this.router.navigateByUrl('/auth');
          }
        }
        return of(err);
      })
    );
  }
}
