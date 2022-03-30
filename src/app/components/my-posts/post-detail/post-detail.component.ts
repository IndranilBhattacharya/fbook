import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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

  constructor(private _fileService: FileService) {}

  ngOnInit(): void {
    this.postText.setValue(this.postData?.post || '');
    const postImgID = this.postData.postImageId;
    if (postImgID) {
      this.fetchPostImage(postImgID);
    } else {
      this.postImgUrl = '';
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  fetchPostImage(photoId: string) {
    this._fileService
      .getImage(photoId)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((imgUrl$) => {
        imgUrl$.pipe(takeUntil(this.isDestroyed)).subscribe((loader) => {
          loader()
            .pipe(takeUntil(this.isDestroyed))
            .subscribe((objUrl) => {
              this.postImgUrl = objUrl ?? '';
            });
        });
      });
  }
}
