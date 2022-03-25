import { authReducer } from './reducers/auth.reducer';
import { toastReducer } from './reducers/toast.reducer';

export const appReducer = {
  auth: authReducer,
  toastParam: toastReducer,
};
