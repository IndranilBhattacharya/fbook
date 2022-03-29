import { Component } from '@angular/core';

@Component({
  selector: 'app-post-loading-placeholder',
  template: `
    <div class="card w-full">
      <div class="flex flex-col w-full">
        <div
          class="h-2 animate-pulse bg-slate-200 rounded w-9/12 py-1 mb-3"
        ></div>
        <div class="h-2 animate-pulse bg-slate-200 rounded w-7/12 mb-3"></div>
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
        @apply w-full h-full;
      }
    `,
  ],
})
export class PostLoadingPlaceholderComponent {}
