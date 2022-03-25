import { Action, createReducer } from '@ngrx/store';
import { UserDetail } from 'src/app/interfaces/user-detail';

const _reducerHandler = createReducer({} as UserDetail);

export const authReducer = (state: UserDetail | undefined, action: Action) =>
  _reducerHandler(state, action);
