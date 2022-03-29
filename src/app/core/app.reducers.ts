import { authReducer } from './reducers/auth.reducer';
import { rootScrollReducer } from './reducers/root-scroll.reducer';
import { toastReducer } from './reducers/toast.reducer';

export const appReducer = {
  auth: authReducer,
  toastParam: toastReducer,
  rootScrollTop: rootScrollReducer,
};
