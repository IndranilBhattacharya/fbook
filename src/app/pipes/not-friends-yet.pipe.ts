import { Pipe, PipeTransform } from '@angular/core';
import { Friend } from '../interfaces/friend';
import { UserDetail } from '../interfaces/user-detail';

@Pipe({
  name: 'notFriendsYet',
})
export class NotFriendsYetPipe implements PipeTransform {
  transform(value: UserDetail[], arg: Friend[]): UserDetail[] {
    if (arg) {
      return value?.filter(
        (user) => !arg?.map((argUser) => argUser.friendId)?.includes(user._id)
      );
    }
    return [];
  }
}
