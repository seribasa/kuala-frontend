import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

// Simple token storage keys
const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private authenticated$ = new BehaviorSubject<boolean>(this.hasToken());

  // Expose as observable if components need to react to auth changes
  readonly isAuthenticated$ = this.authenticated$.asObservable();

  // Call backend API to authenticate
  login(payload: Record<string, unknown>): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/auth/v1/authorize', payload).pipe(
      tap(response => {
        this.setToken(response.token);
        this.authenticated$.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.authenticated$.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
