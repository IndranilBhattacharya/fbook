import { ToastParam } from 'src/app/interfaces/toast-param';

export const defaultToast = {
  position: 'bottom-right',
  transition: 'bounce',
  autoClose: 4000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnVisibilityChange: true,
  iconLibrary: 'font-awesome',
} as ToastParam;
