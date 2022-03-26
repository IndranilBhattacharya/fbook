import { Action, createReducer, on } from '@ngrx/store';
import { UserDetail } from 'src/app/interfaces/user-detail';
import { updateUserData } from '../actions/auth.actions';

const _reducerHandler = createReducer(
  {} as UserDetail,
  on(updateUserData, (state, action) => {
    return { ...state, ...action.val };
  })
);

export const authReducer = (state: UserDetail | undefined, action: Action) =>
  _reducerHandler(state, action);
