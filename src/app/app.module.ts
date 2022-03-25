import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RemixIconModule } from 'angular-remix-icon';
import { iconsConfig } from './constants/icon.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './core/app.reducers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { EqualValidatorDirective } from './customs/equal-validator.directive';

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
    RemixIconModule.configure(iconsConfig),
    AngularToastifyModule,
  ],
  providers: [ToastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
