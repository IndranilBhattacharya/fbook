import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const panOut = [
  trigger('panOut', [
    state(
      'initial',
      style({ display: 'flex', transform: 'translateX(0)', opacity: 1 })
    ),
    state(
      'final',
      style({
        display: 'none',
        transform: 'translateX(-100%)',
        opacity: 0,
      })
    ),
    transition('final<=>initial', animate('500ms')),
  ]),
];
