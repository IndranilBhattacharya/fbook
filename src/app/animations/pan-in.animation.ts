import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const panIn = [
  trigger('panIn', [
    state(
      'initial',
      style({ display: 'none', transform: 'translateX(100%)', opacity: 0 })
    ),
    state(
      'final',
      style({ display: 'flex', transform: 'translateX(0%)', opacity: 1 })
    ),
    transition('final<=>initial', animate('500ms')),
  ]),
];
