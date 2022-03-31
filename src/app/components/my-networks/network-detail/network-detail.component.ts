import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserDetail } from '../../../interfaces/user-detail';
import { FileService } from '../../../services/file.service';
import { Friend } from 'src/app/interfaces/friend';
@Component({
  selector: 'app-network-detail',
  templateUrl: './network-detail.component.html',
  styleUrls: ['./network-detail.component.scss'],
})
export class NetworkDetailComponent implements OnInit, OnDestroy {
  isDestroyed = new Subject();
  isRequestSent: boolean = false;
  @Input('userInformation') networkDetail!: UserDetail;
  @Input() loggedInUserId: string = '';
  @Input() listOfFriends: Friend[] | null = null;
  @Input() myRequest: boolean | null = false;
  @Input() pendingRequest: boolean | null = false;
  @Input() actionRequired: boolean | null = true;
  @Output() onFriendStatusChange = new EventEmitter();
  networkImgUrl: string = 'no_image';

  constructor(private _fileService: FileService) {}

  ngOnInit(): void {
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

  onChangeRelation(targetStatus: string) {
    const requestId = this.listOfFriends
      ?.filter(
        (f) =>
          ((this.myRequest &&
            f.userId === this.loggedInUserId &&
            f.friendId === this.networkDetail?._id) ||
            (this.pendingRequest &&
              f.userId === this.networkDetail?._id &&
              f.friendId === this.loggedInUserId)) &&
          f?.status?.toLowerCase()?.includes('pending')
      )
      ?.map((r) => r._id)[0];
    this.onFriendStatusChange.emit({
      userInfo: this.networkDetail,
      targetStatus,
      requestId,
    });
    this.isRequestSent = true;
  }
}
