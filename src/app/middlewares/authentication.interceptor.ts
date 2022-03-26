import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, filter, Observable, of, takeWhile } from 'rxjs';
import { LocalStorage } from 'ngx-webstorage';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor, OnDestroy {
  @LocalStorage()
  authToken!: string;
  isAlive: boolean = true;
  activeRoute: string = '';

  constructor(private router: Router) {
    this.checkCurrentUrl();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  checkCurrentUrl() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeWhile(() => this.isAlive)
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
