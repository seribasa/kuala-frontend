import {inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/',
});

export interface ApiRequestOptions {
  params?: Record<string, any> | HttpParams;
  headers?: HttpHeaders | Record<string, string>;
}

@Injectable({providedIn: 'root'})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  // Optional: centrally managed token if you don’t use an interceptor
  private authToken: string | null = null;

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  get<T>(url: string, options?: ApiRequestOptions): Observable<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  post<T>(url: string, body?: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.request<T>('POST', url, body, options);
  }

  put<T>(url: string, body?: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.request<T>('PUT', url, body, options);
  }

  patch<T>(url: string, body?: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.request<T>('PATCH', url, body, options);
  }

  delete<T>(url: string, options?: ApiRequestOptions): Observable<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  private request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Observable<T> {
    const fullUrl = this.joinUrl(this.baseUrl, url);
    const headers = this.buildHeaders(options?.headers);
    const params = this.buildParams(options?.params);

    return this.http
      .request<T>(method, fullUrl, {body, headers, params})
      .pipe(catchError((error) => this.handleError(error, {method, fullUrl})));
  }

  private buildHeaders(custom?: HttpHeaders | Record<string, string>): HttpHeaders {
    const defaults: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      defaults['Authorization'] = `Bearer ${this.authToken}`;
    }

    let headers = new HttpHeaders(defaults);

    if (custom instanceof HttpHeaders) {
      // Merge custom headers over defaults
      custom.keys().forEach((k) => {
        const v = custom.get(k);
        if (v !== null) headers = headers.set(k, v);
      });
    } else if (custom && typeof custom === 'object') {
      Object.entries(custom).forEach(([k, v]) => {
        if (v !== undefined && v !== null) headers = headers.set(k, String(v));
      });
    }

    return headers;
  }

  private buildParams(input?: Record<string, any> | HttpParams): HttpParams {
    if (input instanceof HttpParams) return input;

    let params = new HttpParams();
    if (!input) return params;

    Object.entries(input).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // Support arrays and scalars
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== undefined && v !== null) params = params.append(key, String(v));
        });
      } else {
        params = params.set(key, String(value));
      }
    });

    return params;
  }

  private handleError(error: unknown, ctx: { method: string; fullUrl: string }) {
    // Centralized error mapping
    if (error instanceof HttpErrorResponse) {
      const normalized = {
        status: error.status,
        message:
          error.error?.message ??
          error.statusText ??
          'An unexpected error occurred while calling the API.',
        url: ctx.fullUrl,
        method: ctx.method,
        details: error.error ?? null,
      };
      // console.error('[ApiService]', normalized);
      return throwError(() => normalized);
    }

    return throwError(() => ({
      status: 0,
      message: 'Network error or request was interrupted.',
      url: ctx.fullUrl,
      method: ctx.method,
    }));
  }

  private joinUrl(base: string, path: string): string {
    if (!base) return path;
    if (!path) return base;
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    const p = path.startsWith('/') ? path.slice(1) : path;
    return `${b}/${p}`;
  }
}
