import { createAction, props } from '@ngrx/store';

const preActionText = 'change';

export const position = createAction(
  `${preActionText}_position`,
  props<{ val: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left' }>()
);
export const transition = createAction(
  `${preActionText}_transition`,
  props<{ val: 'bounce' | 'slide' | 'zoom' | 'flip' }>()
);
export const autoClose = createAction(
  `${preActionText}_autoClose`,
  props<{ val: number }>()
);
export const hideProgressBar = createAction(
  `${preActionText}_hideProgressBar`,
  props<{ val: boolean }>()
);
export const newestOnTop = createAction(
  `${preActionText}_newestOnTop`,
  props<{ val: boolean }>()
);
export const closeOnClick = createAction(
  `${preActionText}_closeOnClick`,
  props<{ val: boolean }>()
);
export const pauseOnHover = createAction(
  `${preActionText}_pauseOnHover`,
  props<{ val: boolean }>()
);
export const pauseOnVisibilityChange = createAction(
  `${preActionText}_pauseOnVisibilityChange`,
  props<{ val: boolean }>()
);
export const iconLibrary = createAction(
  `${preActionText}_iconLibrary`,
  props<{ val: 'material' | 'font-awesome' | 'none' }>()
);
