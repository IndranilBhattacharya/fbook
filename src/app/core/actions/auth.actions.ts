import { createAction, props } from '@ngrx/store';
import { UserDetail } from '../../interfaces/user-detail';

const preActionText = 'auth_update';

export const updateUserData = createAction(
  `${preActionText}_user_details`,
  props<{ val: UserDetail }>()
);
