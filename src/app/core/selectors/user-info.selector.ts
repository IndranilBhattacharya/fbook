import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserDetail } from '../../interfaces/user-detail';

const getAuthState = createFeatureSelector<UserDetail>('auth');

export const userId = createSelector(getAuthState, (state) => state._id);

export const photoId = createSelector(getAuthState, (state) => state.photoId);

export const numOfPosts = createSelector(
  getAuthState,
  (state) => state.numOfPosts
);

export const numOfFriends = createSelector(
  getAuthState,
  (state) => state.numOfFriends
);

export const numOfPendingRequest = createSelector(
  getAuthState,
  (state) => state.numOfPendingRequest
);
