import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ToastParam } from 'src/app/interfaces/toast-param';

const getToastState = createFeatureSelector<ToastParam>('toastParam');

export const toastposition = createSelector(
  getToastState,
  (state) => state.position
);
export const toasttransition = createSelector(
  getToastState,
  (state) => state.transition
);
export const toastautoClose = createSelector(
  getToastState,
  (state) => state.autoClose
);
export const toasthideProgressBar = createSelector(
  getToastState,
  (state) => state.hideProgressBar
);
export const toastnewestOnTop = createSelector(
  getToastState,
  (state) => state.newestOnTop
);
export const toastcloseOnClick = createSelector(
  getToastState,
  (state) => state.closeOnClick
);
export const toastpauseOnHover = createSelector(
  getToastState,
  (state) => state.pauseOnHover
);
export const toastpauseOnVisibilityChange = createSelector(
  getToastState,
  (state) => state.pauseOnVisibilityChange
);
export const toasticonLibrary = createSelector(
  getToastState,
  (state) => state.iconLibrary
);
