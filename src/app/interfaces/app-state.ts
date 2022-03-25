import { ToastParam } from './toast-param';
import { UserDetail } from './user-detail';

export interface AppState {
  auth: UserDetail;
  toastParam: ToastParam;
}
