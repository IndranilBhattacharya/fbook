import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { MyFriendsComponent } from './components/my-friends/my-friends.component';
import { MyNetworksComponent } from './components/my-networks/my-networks.component';
import { MyPostsComponent } from './components/my-posts/my-posts.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'my-posts', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'my-posts', component: MyPostsComponent },
      { path: 'my-friends', component: MyFriendsComponent },
      { path: 'my-networks', component: MyNetworksComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthenticationComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
    ],
  },
  { path: 'components/users', loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule) },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
