import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {API_BASE_URL} from './api/ApiService';
import {AuthService} from './auth/auth.service';

interface RuntimeEnvironment { API_BASE_URL?: string }
interface RuntimeWindow extends Window { __env?: RuntimeEnvironment }
const runtimeEnvironment = typeof window !== 'undefined' ? (window as RuntimeWindow).__env : undefined;
const apiBaseUrl = runtimeEnvironment?.API_BASE_URL ?? 'https://kuala-api-staging.seribasa.digital/v1/kuala';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    {provide: API_BASE_URL, useValue: apiBaseUrl},
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      // Ensure ApiService picks up an existing token
      authService.initialize();

      // Handle OAuth redirect with ?code=...
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (code) {
        return authService.exchangeToken(code)
          .then(() => {
            url.searchParams.delete('code');
            window.history.replaceState({}, '', url.toString());
          })
          .catch(err => {
            console.error('Token exchange failed:', err);
            // Optional: clear tokens just in case and return to landing
            // authService.logout(); // don't await in initializer
            // Optionally redirect to landing/login
            // window.location.replace('/');
          });
      }

      // No async work to wait for
      return;
    })
  ]
};
