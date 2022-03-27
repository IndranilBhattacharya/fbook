import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastService } from 'angular-toastify';
import { catchError, takeWhile } from 'rxjs';
import { AppState } from 'src/app/interfaces/app-state';
import { Post } from 'src/app/interfaces/post';
import { UserDetail } from 'src/app/interfaces/user-detail';
import { FileService } from 'src/app/services/file.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss'],
})
export class MyPostsComponent implements OnInit, OnDestroy {
  isAlive: boolean = true;
  showPostSpinner: boolean = false;
  post: FormControl = new FormControl('');
  postImgBlob!: Blob | null;
  postImgUrl: string = '';
  authInfo!: UserDetail;
  @ViewChild('postImg') postImgElement!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private toastService: ToastService,
    private store: Store<AppState>,
    private _fileService: FileService,
    private _postService: PostService
  ) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((userData) => (this.authInfo = userData));
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  onPost() {
    if (this.post.value && !this.showPostSpinner && this.authInfo._id) {
      this.showPostSpinner = true;
      if (this.postImgBlob) {
        const imgPayload = new FormData();
        imgPayload.append('picture', this.postImgBlob);
        this._fileService
          .uploadPhoto(imgPayload)
          .pipe(
            takeWhile(() => this.isAlive),
            catchError((err) => {
              this.showPostSpinner = false;
              this.postImgUrl = '';
              this.renderer.setValue(
                this.postImgElement.nativeElement.files,
                ''
              );
              throw err;
            })
          )
          .subscribe((photoId) => {
            this.postImgUrl = '';
            this.renderer.setProperty(
              this.postImgElement.nativeElement,
              'value',
              ''
            );
            this.publishPost(photoId);
          });
      } else {
        this.publishPost('');
      }
    }
  }

  publishPost(photoId: string) {
    const postPayload = {
      post: this.post.value,
      userId: this.authInfo._id,
      userName: `${this.authInfo.firstName} ${this.authInfo.lastName}`,
      userPhotoId: this.authInfo.photoId,
      postImageId: photoId,
      isActive: this.authInfo.isActive,
      isAdmin: this.authInfo.isAdmin,
    } as Post;
    this._postService
      .createPost(postPayload)
      .pipe(
        takeWhile(() => this.isAlive),
        catchError((err) => {
          this.showPostSpinner = false;
          throw err;
        })
      )
      .subscribe((msg) => {
        this.showPostSpinner = false;
        this.post.reset();
        if (msg.message?.includes('success')) {
          this.toastService.default('Message sent to the world ✨');
        }
      });
  }

  onSelectPostImg(e: any) {
    this.postImgBlob = null;
    const file = e.target.files?.length > 0 && e.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      if (['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
        this.postImgBlob = file;
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            this.postImgUrl = reader.result as string;
          },
          false
        );
        reader.readAsDataURL(file);
      }
    }
  }
}
