import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription, takeWhile } from 'rxjs';
import { AppState } from '../../interfaces/app-state';
import { FileService } from '../../services/file.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAlive: boolean = true;
  authDetail$!: Subscription;
  userProfileImgUrl: string = '';

  constructor(
    private store: Store<AppState>,
    private _userDataService: UserDataService,
    private _fileService: FileService
  ) {}

  ngOnInit(): void {
    this.authDetail$ = this.store
      .select('auth')
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((userDetail) => {
        if (userDetail?.photoId) {
          this.fetchUserProfileImg(userDetail.photoId);
        }
      });
  }

  fetchUserProfileImg(photoId: string) {
    this._fileService
      .getUserProfileImg(photoId)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((imgUrl$) => {
        imgUrl$.pipe(takeWhile(() => this.isAlive)).subscribe((loader) => {
          loader()
            .pipe(takeWhile(() => this.isAlive))
            .subscribe((data) => {
              this.userProfileImgUrl = data as string;
            });
        });
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
    this.authDetail$.unsubscribe();
  }
}
