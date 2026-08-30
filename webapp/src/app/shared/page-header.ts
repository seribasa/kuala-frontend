import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-slate-950">{{ title() }}</h1>
      @if (description()) {
        <p class="mt-2 max-w-2xl text-sm text-slate-600">{{ description() }}</p>
      }
    </header>
  `
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input('');
}
