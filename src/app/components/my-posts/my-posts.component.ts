import {
  AfterViewInit,
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
import { catchError, sampleTime, Subject, takeUntil } from 'rxjs';
import { photoId } from '../../core/selectors/user-info.selector';
import { AppState } from '../../interfaces/app-state';
import { Post } from '../../interfaces/post';
import { UserDetail } from '../../interfaces/user-detail';
import { AuthenticationService } from '../../services/authentication.service';
import { FileService } from '../../services/file.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss'],
})
export class MyPostsComponent implements OnInit, AfterViewInit, OnDestroy {
  isDestroyed = new Subject();
  showPostSpinner: boolean = false;
  showLoadPostSpinner: boolean = true;
  post: FormControl = new FormControl('');
  postImgBlob!: Blob | null;
  postImgUrl: string = '';
  authInfo!: UserDetail;
  allPosts: Post[] = [];
  prevScrollTop: number = 0;

  @ViewChild('postImg') postImgElement!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private toastService: ToastService,
    private store: Store<AppState>,
    private _authService: AuthenticationService,
    private _fileService: FileService,
    private _postService: PostService
  ) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((userData) => {
        this.authInfo = { ...userData };
      });
    this.store
      .select(photoId)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this.fetchAllPosts();
      });
  }

  ngAfterViewInit(): void {
    this.observerRootScroll();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  observerRootScroll() {
    const postCreationCardElem = this.renderer.selectRootElement(
      document.getElementById('card_creation_elem'),
      true
    );
    this.store
      .select('rootScrollTop')
      .pipe(sampleTime(500), takeUntil(this.isDestroyed))
      .subscribe((scrollInfo) => {
        if (scrollInfo.rootScrollTop > this.prevScrollTop) {
          this.renderer.removeClass(postCreationCardElem, 'dynamic-card-post');
          this.renderer.removeClass(postCreationCardElem, 'slide-in-top');
          this.renderer.addClass(postCreationCardElem, 'hidden');
        } else {
          this.renderer.removeClass(postCreationCardElem, 'hidden');
          this.renderer.addClass(postCreationCardElem, 'slide-in-top');
          this.renderer.addClass(postCreationCardElem, 'dynamic-card-post');
        }
        this.prevScrollTop = scrollInfo.rootScrollTop;
      });
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
            takeUntil(this.isDestroyed),
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
            this.removePostImg();
            this.publishPost(photoId);
          });
      } else {
        this.publishPost('');
      }
    }
  }

  fetchAllPosts() {
    (this.authInfo?.isAdmin
      ? this._postService.getEntirePostsList()
      : this._postService.getAllPosts()
    )
      .pipe(
        takeUntil(this.isDestroyed),
        catchError((err) => {
          this.showLoadPostSpinner = false;
          throw err;
        })
      )
      .subscribe((posts) => {
        this.allPosts = posts;
        this.showLoadPostSpinner = false;
      });
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
        takeUntil(this.isDestroyed),
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
          this.fetchAllPosts();
          this._authService.updateUserPosts(this.authInfo._id);
        }
      });
  }

  onSelectPostImg(e: any) {
    const file = e?.target?.files?.length > 0 && e?.target?.files[0];
    if (file) {
      this.postImgBlob = null;
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

  removePostImg() {
    this.postImgUrl = '';
    this.renderer.setProperty(this.postImgElement.nativeElement, 'value', '');
  }

  onRefreshPost(e: { updated: boolean }) {
    if (e.updated) {
      this.fetchAllPosts();
    }
  }
}
