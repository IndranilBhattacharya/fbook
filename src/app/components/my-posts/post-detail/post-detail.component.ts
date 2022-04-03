import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, Observable, Subject, takeUntil } from 'rxjs';
import { FileService } from '../../../services/file.service';
import { Post } from '../../../interfaces/post';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  isDestroyed = new Subject();
  @Input() postData!: Post;
  postText: FormControl = new FormControl('');
  postImgUrl: string = 'no_image';
  userImgUrl: string = 'no_image';

  constructor(private _fileService: FileService) {}

  ngOnInit(): void {
    this.postText.setValue(this.postData?.post || '');
    this.setPostImageUrl();
    this.setUserImageUrl();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  setPostImageUrl() {
    const postImgID = this.postData.postImageId;
    if (postImgID) {
      this.fetchPostImage(postImgID);
    } else {
      this.userImgUrl = '';
    }
  }

  setUserImageUrl() {
    const userImgID = this.postData.userPhotoId;
    if (userImgID) {
      this.fetchUserImage(userImgID);
    } else {
      this.postImgUrl = '';
    }
  }

  fetchResourcePerId(
    id: string
  ): Observable<Observable<() => Observable<string>>> {
    return this._fileService.getImage(id).pipe(takeUntil(this.isDestroyed));
  }

  fetchPostImage(postImgId: string) {
    this.fetchResourcePerId(postImgId).subscribe((imgUrl$) => {
      imgUrl$.pipe(takeUntil(this.isDestroyed)).subscribe((loader) => {
        loader()
          .pipe(
            takeUntil(this.isDestroyed),
            catchError((err) => {
              this.postImgUrl = '';
              throw err;
            })
          )
          .subscribe((objUrl) => {
            this.postImgUrl = objUrl ?? '';
          });
      });
    });
  }

  fetchUserImage(userImgId: string) {
    this.fetchResourcePerId(userImgId).subscribe((imgUrl$) => {
      imgUrl$.pipe(takeUntil(this.isDestroyed)).subscribe((loader) => {
        loader()
          .pipe(
            takeUntil(this.isDestroyed),
            catchError((err) => {
              this.userImgUrl = '';
              throw err;
            })
          )
          .subscribe((objUrl) => {
            this.userImgUrl = objUrl ?? '';
          });
      });
    });
  }
}
