import { Action, createReducer, on } from '@ngrx/store';
import { ToastParam } from 'src/app/interfaces/toast-param';
import {
  autoClose,
  closeOnClick,
  hideProgressBar,
  iconLibrary,
  newestOnTop,
  pauseOnHover,
  pauseOnVisibilityChange,
  position,
  transition,
} from '../actions/toast.actions';
import { defaultToast } from '../init-states/toast.initial';

const _reducerHandler = createReducer(
  defaultToast,
  on(position, (state, action) => {
    return { ...state, position: action.val };
  }),
  on(transition, (state, action) => {
    return { ...state, transition: action.val };
  }),
  on(autoClose, (state, action) => {
    return { ...state, autoClose: action.val };
  }),
  on(hideProgressBar, (state, action) => {
    return { ...state, hideProgressBar: action.val };
  }),
  on(newestOnTop, (state, action) => {
    return { ...state, newestOnTop: action.val };
  }),
  on(closeOnClick, (state, action) => {
    return { ...state, closeOnClick: action.val };
  }),
  on(pauseOnHover, (state, action) => {
    return { ...state, pauseOnHover: action.val };
  }),
  on(pauseOnVisibilityChange, (state, action) => {
    return { ...state, pauseOnVisibilityChange: action.val };
  }),
  on(iconLibrary, (state, action) => {
    return { ...state, iconLibrary: action.val };
  })
);

export const toastReducer = (state: ToastParam | undefined, action: Action) =>
  _reducerHandler(state, action);
