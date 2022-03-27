import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, takeWhile } from 'rxjs';
import { FileService } from '../../services/file.service';
import { PostService } from '../../services/post.service';
import { AppState } from '../../interfaces/app-state';
import { FriendService } from '../../services/friend.service';
import { UserDetail } from '../../interfaces/user-detail';

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
    private _fileService: FileService,
    private _postService: PostService,
    private _friendService: FriendService
  ) {}

  ngOnInit(): void {
    this.userInfo$ = this.store.select('auth');
    this.fetchUserInfo();
  }

  fetchUserInfo() {
    this.userInfo$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((userDetail) => {
        if (userDetail?.photoId) {
          this.fetchUserProfileImg(userDetail.photoId);
        }
        if (userDetail?._id) {
          this.postNum$ = this._postService.getMyNumOfPosts(userDetail._id);
          this.friendsNum$ = this._friendService.getMyNumOfFriends(
            userDetail._id
          );
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
