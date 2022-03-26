import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RemixIconModule } from 'angular-remix-icon';
import { iconsConfig } from './constants/icon.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './core/app.reducers';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { EqualValidatorDirective } from './customs/equal-validator.directive';
import { DatePipe } from '@angular/common';
import { AuthenticationInterceptor } from './middlewares/authentication.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ResetPasswordComponent,
    EqualValidatorDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducer),
    NgxWebstorageModule.forRoot(),
    RemixIconModule.configure(iconsConfig),
    AngularToastifyModule,
  ],
  providers: [
    ToastService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
