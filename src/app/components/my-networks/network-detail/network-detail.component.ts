import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserDetail } from '../../../interfaces/user-detail';
import { FileService } from '../../../services/file.service';
import { AppState } from '../../../interfaces/app-state';
@Component({
  selector: 'app-network-detail',
  templateUrl: './network-detail.component.html',
  styleUrls: ['./network-detail.component.scss'],
})
export class NetworkDetailComponent implements AfterViewInit, OnDestroy {
  isDestroyed = new Subject();
  isRequestSent: boolean = false;
  @Input('userInformation') networkDetail!: UserDetail;
  @Output() onFriendStatusChange = new EventEmitter();
  networkImgUrl: string = 'no_image';
  authInfo$!: Observable<UserDetail>;

  constructor(
    private store: Store<AppState>,
    private _fileService: FileService
  ) {}

  ngAfterViewInit(): void {
    this.authInfo$ = this.store.select('auth');
    this.fetchUserProfileImg(this.networkDetail?.photoId);
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
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
              this.networkImgUrl = objUrl ?? '';
            });
        });
      });
  }

  onChangeRelation() {
    this.onFriendStatusChange.emit({
      userInfo: this.networkDetail,
    });
    this.isRequestSent = true;
  }
}
