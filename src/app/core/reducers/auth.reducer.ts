import { Action, createReducer, on } from '@ngrx/store';
import { UserDetail } from '../../interfaces/user-detail';
import {
  updateUserData,
  updateUserNumFriends,
  updateUserNumPosts,
  updateUserPendingRequests,
  updateUserPhoto,
} from '../actions/auth.actions';

const _reducerHandler = createReducer(
  {} as UserDetail,
  on(updateUserData, (state, action) => {
    return { ...state, ...action.val };
  }),
  on(updateUserPhoto, (state, action) => {
    return { ...state, photoId: action.val };
  }),
  on(updateUserNumPosts, (state, action) => {
    return { ...state, numOfPosts: action.val };
  }),
  on(updateUserNumFriends, (state, action) => {
    return { ...state, numOfFriends: action.val };
  }),
  on(updateUserPendingRequests, (state, action) => {
    return { ...state, numOfPendingRequest: action.val };
  })
);

export const authReducer = (state: UserDetail | undefined, action: Action) =>
  _reducerHandler(state, action);
