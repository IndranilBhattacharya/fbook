import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  toastautoClose,
  toastcloseOnClick,
  toasthideProgressBar,
  toasticonLibrary,
  toastnewestOnTop,
  toastpauseOnHover,
  toastpauseOnVisibilityChange,
  toastposition,
  toasttransition,
} from './core/selectors/toast-param.selector';
import { AppState } from './interfaces/app-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  toastposition$!: Observable<
    'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
  >;
  toasttransition$!: Observable<'bounce' | 'slide' | 'zoom' | 'flip'>;
  toastautoClose$!: Observable<number>;
  toasthideProgressBar$!: Observable<boolean>;
  toastnewestOnTop$!: Observable<boolean>;
  toastcloseOnClick$!: Observable<boolean>;
  toastpauseOnHover$!: Observable<boolean>;
  toastpauseOnVisibilityChange$!: Observable<boolean>;
  toasticonLibrary$!: Observable<'material' | 'font-awesome' | 'none'>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.toastposition$ = this.store.select(toastposition);
    this.toasttransition$ = this.store.select(toasttransition);
    this.toastautoClose$ = this.store.select(toastautoClose);
    this.toasthideProgressBar$ = this.store.select(toasthideProgressBar);
    this.toastnewestOnTop$ = this.store.select(toastnewestOnTop);
    this.toastcloseOnClick$ = this.store.select(toastcloseOnClick);
    this.toastpauseOnHover$ = this.store.select(toastpauseOnHover);
    this.toastpauseOnVisibilityChange$ = this.store.select(
      toastpauseOnVisibilityChange
    );
    this.toasticonLibrary$ = this.store.select(toasticonLibrary);
  }
}
