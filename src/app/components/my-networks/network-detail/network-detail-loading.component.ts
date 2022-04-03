import { Component } from '@angular/core';

@Component({
  selector: 'app-network-loading',
  template: `
    <div class="card w-full">
      <div class="flex items-center w-full">
        <div class="flex items-center w-full gap-5">
          <div
            class="w-10 md:w-14 xl:w-20 aspect-square rounded-full animate-pulse bg-slate-200 shadow"
          ></div>
          <div class="flex flex-col w-full">
            <div
              class="w-11/12 h-2 animate-pulse bg-slate-200 rounded my-2"
            ></div>
            <div class="w-5/12 h-2 animate-pulse bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-network-loading {
        @apply w-full;
      }
    `,
  ],
})
export class NetworkDetailLoadingComponent {}
