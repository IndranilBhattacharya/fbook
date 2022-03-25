export interface ToastParam {
  position: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  transition: 'bounce' | 'slide' | 'zoom' | 'flip';
  autoClose: number;
  hideProgressBar: boolean;
  newestOnTop: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  pauseOnVisibilityChange: boolean;
  iconLibrary: 'material' | 'font-awesome' | 'none';
}
