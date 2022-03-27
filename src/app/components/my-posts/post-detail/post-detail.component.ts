import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeWhile } from 'rxjs';
import { FileService } from '../../../services/file.service';
import { Post } from '../../../interfaces/post';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  isAlive: boolean = true;
  @Input('postData') postData!: Post;
  postText: FormControl = new FormControl('');
  postImgUrl: string = 'no_image';

  constructor(private _fileService: FileService) {}

  ngOnInit(): void {
    this.postText.setValue(this.postData?.post || '');
    const postImgID = this.postData.postImageId;
    if (postImgID) {
      this.fetchUserProfileImg(postImgID);
    } else {
      this.postImgUrl = '';
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
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
              this.postImgUrl = objUrl ?? '';
            });
        });
      });
  }
}
