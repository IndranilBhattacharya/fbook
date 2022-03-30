import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserDetail } from '../../../interfaces/user-detail';
import { FileService } from '../../../services/file.service';
import { Friend } from '../../../interfaces/friend';
import { UserDataService } from '../../../services/user-data.service';
@Component({
  selector: 'app-network-detail',
  templateUrl: './network-detail.component.html',
  styleUrls: ['./network-detail.component.scss'],
})
export class NetworkDetailComponent implements AfterViewInit, OnDestroy {
  isDestroyed = new Subject();
  @Input() userInformation!: Friend;
  @Output() onFriendStatusChange = new EventEmitter();
  networkImgUrl: string = 'no_image';
  networkDetail!: UserDetail;

  constructor(
    private _userDataService: UserDataService,
    private _fileService: FileService
  ) {}

  ngAfterViewInit(): void {
    this.fetchUserInfo();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  fetchUserInfo() {
    this.userInformation?.friendId &&
      this._userDataService
        .getUserById(this.userInformation?.friendId)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((userData) => {
          this.networkDetail = { ...userData };
          userData?.photoId && this.fetchUserProfileImg(userData?.photoId);
        });
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
}
