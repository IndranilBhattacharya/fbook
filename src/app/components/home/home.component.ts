import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, takeWhile } from 'rxjs';
import { FileService } from '../../services/file.service';
import { AppState } from '../../interfaces/app-state';
import { UserDetail } from '../../interfaces/user-detail';
import {
  numOfFriends,
  numOfPosts,
  photoId,
} from '../../core/selectors/user-info.selector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAlive: boolean = true;
  userInfo$!: Observable<UserDetail>;
  postNum$!: Observable<number>;
  friendsNum$!: Observable<number>;
  userProfileImgUrl: string = '';

  constructor(
    private store: Store<AppState>,
    private _fileService: FileService
  ) {}

  ngOnInit(): void {
    this.userInfo$ = this.store.select('auth');
    this.fetchUserInfo();
    this.observeUserPhoto();
  }

  fetchUserInfo() {
    this.userInfo$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((userDetail) => {
        if (userDetail?._id) {
          this.postNum$ = this.store.select(numOfPosts);
          this.friendsNum$ = this.store.select(numOfFriends);
        }
      });
  }

  observeUserPhoto() {
    this.store
      .select(photoId)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((id) => id && this.fetchUserProfileImg(id));
  }

  fetchUserProfileImg(photoId: string) {
    this._fileService
      .getUserProfileImg(photoId)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((imgUrl$) => {
        imgUrl$.pipe(takeWhile(() => this.isAlive)).subscribe((loader) => {
          loader()
            .pipe(takeWhile(() => this.isAlive))
            .subscribe((objUrl) => {
              this.userProfileImgUrl = objUrl;
            });
        });
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
