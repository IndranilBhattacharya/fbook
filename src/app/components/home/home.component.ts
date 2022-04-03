import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, Observable, Subject, takeUntil } from 'rxjs';
import { FileService } from '../../services/file.service';
import { AppState } from '../../interfaces/app-state';
import { UserDetail } from '../../interfaces/user-detail';
import {
  numOfFriends,
  numOfPosts,
  photoId,
} from '../../core/selectors/user-info.selector';
import { UserIdPhotoId } from 'src/app/interfaces/user-id-photo-id';
import { UserDataService } from 'src/app/services/user-data.service';
import { ToastService } from 'angular-toastify';
import { updateUserPhoto } from 'src/app/core/actions/auth.actions';
import { PostService } from 'src/app/services/post.service';
import { BulkUpdatePost } from 'src/app/interfaces/bulk-update-post';

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
  userId: string = '';

  constructor(
    private store: Store<AppState>,
    private _toastService: ToastService,
    private _fileService: FileService,
    private _userDataService: UserDataService,
    private _postService: PostService
  ) {}

  ngOnInit(): void {
    this.userInfo$ = this.store.select('auth');
    this.fetchUserInfo();
    this.observeUserPhoto();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  fetchUserInfo() {
    this.userInfo$.pipe(takeUntil(this.isDestroyed)).subscribe((userDetail) => {
      if (userDetail?._id) {
        this.userId = userDetail?._id;
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
      .getImage(photoId)
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

  updateProfileImg(e: any) {
    const file = e?.target?.files?.length > 0 && e?.target?.files[0];
    if (file) {
      this.userProfileImgUrl = '';
      const fileName = file.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      if (['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
        const imgPayload = new FormData();
        imgPayload.append('picture', file);
        this._fileService
          .uploadPhoto(imgPayload)
          .pipe(
            takeUntil(this.isDestroyed),
            catchError((err) => {
              this.userProfileImgUrl = '';
              throw err;
            })
          )
          .subscribe((photoId) => {
            this.updateUserPhotoId(photoId);
          });
      }
    }
  }

  updateUserPhotoId(photoId: string) {
    const payload = { id: this.userId, photoId } as UserIdPhotoId;
    this._userDataService
      .updateUserPhotoId(payload)
      .pipe(
        takeUntil(this.isDestroyed),
        catchError((err) => {
          this.userProfileImgUrl = '';
          throw err;
        })
      )
      .subscribe(() => {
        this._toastService.default('Profile picture updated 🥳');
        this.fetchUserProfileImg(photoId);
        this.updateBulkPosts(photoId);
      });
  }

  updateBulkPosts(newPhotoId: string) {
    const bulkUpdatePayload = {
      userId: this.userId,
      photoId: newPhotoId,
    } as BulkUpdatePost;
    this._postService
      .updatePostsAsBulk(bulkUpdatePayload)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this.store.dispatch(updateUserPhoto({ val: newPhotoId }));
      });
  }
}
