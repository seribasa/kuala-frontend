import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {API_BASE_URL} from './api/ApiService';

const apiBaseUrl =
  (typeof window !== 'undefined' && (window as any).__env && (window as any).__env.API_BASE_URL)
    ? (window as any).__env.API_BASE_URL
    : 'https://kuala-api-staging.seribasa.digital';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    {provide: API_BASE_URL, useValue: apiBaseUrl}
  ]
};
