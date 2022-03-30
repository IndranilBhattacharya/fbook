import { Pipe, PipeTransform } from '@angular/core';
import { Friend } from '../interfaces/friend';

@Pipe({
  name: 'notFriendsYet',
})
export class NotFriendsYetPipe implements PipeTransform {
  transform(value: Friend[], arg: string | undefined): Friend[] {
    if (arg) {
      return value.filter(
        (user) =>
          (user?.userId !== arg && user?.friendId !== arg) ||
          (user?.userId === arg &&
            (user?.status?.includes('unfriend') ||
              !user?.status?.includes('friend')))
      );
    }
    return [];
  }
}
