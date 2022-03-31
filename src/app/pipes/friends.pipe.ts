import { Pipe, PipeTransform } from '@angular/core';
import { Friend } from '../interfaces/friend';
import { UserDetail } from '../interfaces/user-detail';

@Pipe({
  name: 'friends',
})
export class FriendsPipe implements PipeTransform {
  transform(value: UserDetail[], arg: Friend[]): UserDetail[] {
    if (arg) {
      return value?.filter((user) =>
        arg
          ?.filter(
            (friend) =>
              !friend?.status?.toLowerCase()?.includes('unfriend') &&
              friend?.status?.toLowerCase()?.includes('friend')
          )
          ?.map((argUser) => argUser.friendId)
          ?.includes(user._id)
      );
    }
    return [];
  }
}
