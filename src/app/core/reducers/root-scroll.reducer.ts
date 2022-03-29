import { Action, createReducer, on } from '@ngrx/store';
import { ScrollPosition } from 'src/app/interfaces/scroll-position';
import { updateScrollTop } from '../actions/root-scroll.actions';

const _reducerHandler = createReducer(
  { rootScrollTop: 0 } as ScrollPosition,
  on(updateScrollTop, (state, action) => {
    return { ...state, rootScrollTop: action.val };
  })
);

export const rootScrollReducer = (
  state: ScrollPosition | undefined,
  action: Action
) => _reducerHandler(state, action);
