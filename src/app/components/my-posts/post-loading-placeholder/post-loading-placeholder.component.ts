import { Component } from '@angular/core';

@Component({
  selector: 'app-post-loading-placeholder',
  template: `
    <div class="card w-full shadow-none">
      <div class="flex flex-col w-full">
        <div class="flex gap-6 w-full">
          <div
            class="w-[4.7rem] h-16 rounded-full animate-pulse bg-slate-200"
          ></div>
          <div class="flex flex-col justify-center w-full">
            <div
              class="h-2 animate-pulse bg-slate-200 rounded w-9/12 py-1 mb-3"
            ></div>
            <div
              class="h-2 animate-pulse bg-slate-200 rounded w-7/12 mb-3"
            ></div>
          </div>
        </div>

        <div
          class="h-3 animate-pulse bg-slate-200 rounded w-7/12 mt-4 mb-3"
        ></div>
        <div
          class="w-full aspect-square rounded-md animate-pulse bg-slate-200 shadow"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-post-loading-placeholder {
        @apply w-full;
      }
    `,
  ],
})
export class PostLoadingPlaceholderComponent {}
