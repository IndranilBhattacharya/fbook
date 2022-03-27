import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserDetail } from 'src/app/interfaces/user-detail';

const getAuthState = createFeatureSelector<UserDetail>('auth');

export const photoId = createSelector(getAuthState, (state) => state.photoId);

export const numOfPosts = createSelector(
  getAuthState,
  (state) => state.numOfPosts
);

export const numOfFriends = createSelector(
  getAuthState,
  (state) => state.numOfFriends
);
