import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RemixIconModule } from 'angular-remix-icon';
import { iconsConfig } from './constants/icon.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './core/app.reducers';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { QuillModule } from 'ngx-quill';
import { quillConfiguration } from './constants/quill.config';
import { TooltipModule } from 'ng2-tooltip-directive';

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
import { ToolsComponent } from './components/tools/tools.component';
import { MyPostsComponent } from './components/my-posts/my-posts.component';
import { MyFriendsComponent } from './components/my-friends/my-friends.component';
import { MyNetworksComponent } from './components/my-networks/my-networks.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PostDetailComponent } from './components/my-posts/post-detail/post-detail.component';
import { environment } from '../environments/environment';
import { TrimPipe } from './pipes/trim.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { PostLoadingPlaceholderComponent } from './components/my-posts/post-loading-placeholder/post-loading-placeholder.component';
import { NotFriendsYetPipe } from './pipes/not-friends-yet.pipe';
import { FriendsPipe } from './pipes/friends.pipe';
import { PendingFriendsPipe } from './pipes/pending-friends.pipe';
import { defaultToolTipConfig } from './constants/tooltip.config';
import { SharedComponentsModule } from './middlewares/shared-components/shared-components.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ResetPasswordComponent,
    EqualValidatorDirective,
    ToolsComponent,
    MyPostsComponent,
    MyFriendsComponent,
    MyNetworksComponent,
    SettingsComponent,
    PostDetailComponent,
    TrimPipe,
    TimeAgoPipe,
    PostLoadingPlaceholderComponent,
    NotFriendsYetPipe,
    FriendsPipe,
    PendingFriendsPipe,
  ],
  imports: [
    SharedComponentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularToastifyModule,
    TooltipModule,
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    NgxWebstorageModule.forRoot(),
    RemixIconModule.configure(iconsConfig),
    QuillModule.forRoot(quillConfiguration),
    TooltipModule.forRoot(defaultToolTipConfig),
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
