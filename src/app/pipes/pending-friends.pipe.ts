import { Pipe, PipeTransform } from '@angular/core';
import { UserDetail } from '../interfaces/user-detail';

@Pipe({
  name: 'pendingFriends',
})
export class PendingFriendsPipe implements PipeTransform {
  transform(value: UserDetail[], arg: string[]): UserDetail[] {
    if (arg?.length > 0) {
      return value?.filter((user) => arg?.includes(user._id));
    }
    return [];
  }
}
