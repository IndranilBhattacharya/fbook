import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserDetail } from 'src/app/interfaces/user-detail';

const getToastState = createFeatureSelector<UserDetail>('auth');

export const photoId = createSelector(getToastState, (state) => state.photoId);

export const numOfPosts = createSelector(
  getToastState,
  (state) => state.numOfPosts
);

export const numOfFriends = createSelector(
  getToastState,
  (state) => state.numOfFriends
);
