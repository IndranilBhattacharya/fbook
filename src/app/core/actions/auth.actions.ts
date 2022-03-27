import { createAction, props } from '@ngrx/store';
import { UserDetail } from '../../interfaces/user-detail';

const preActionText = 'auth_update';

export const updateUserData = createAction(
  `${preActionText}_user_details`,
  props<{ val: UserDetail }>()
);

export const updateUserPhoto = createAction(
  `${preActionText}_user_photo_id`,
  props<{ val: string }>()
);

export const updateUserNumPosts = createAction(
  `${preActionText}_user_number_of_posts`,
  props<{ val: number }>()
);

export const updateUserNumFriends = createAction(
  `${preActionText}_user_number_of_friends`,
  props<{ val: number }>()
);
