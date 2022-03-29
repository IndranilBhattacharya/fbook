import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
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
  isDestroyed = new Subject();
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
    this.userInfo$.pipe(takeUntil(this.isDestroyed)).subscribe((userDetail) => {
      if (userDetail?._id) {
        this.postNum$ = this.store.select(numOfPosts);
        this.friendsNum$ = this.store.select(numOfFriends);
      }
    });
  }

  observeUserPhoto() {
    this.store
      .select(photoId)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((id) => id && this.fetchUserProfileImg(id));
  }

  fetchUserProfileImg(photoId: string) {
    this._fileService
      .getUserProfileImg(photoId)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((imgUrl$) => {
        imgUrl$.pipe(takeUntil(this.isDestroyed)).subscribe((loader) => {
          loader()
            .pipe(takeUntil(this.isDestroyed))
            .subscribe((objUrl) => {
              this.userProfileImgUrl = objUrl;
            });
        });
      });
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }
}
