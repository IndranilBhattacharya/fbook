import { createAction, props } from '@ngrx/store';

export const updateScrollTop = createAction(
  `update-scroll-top`,
  props<{ val: number }>()
);
