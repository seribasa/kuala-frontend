import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {ApiService} from '../api/ApiService';

// Token storage keys
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const CODE_VERIFIER_KEY = 'auth_code_verifier';

interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user?: User;
}

interface User {
  id: string;
  email: string;

  [key: string]: any;
}


@Injectable({providedIn: 'root'})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private authenticated$ = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser$ = new BehaviorSubject<User | null>(null);

  // Expose as observable if components need to react to auth changes
  readonly isAuthenticated$ = this.authenticated$.asObservable();
  readonly user$ = this.currentUser$.asObservable();

  /**
   * Initiates the PKCE OAuth flow by redirecting to the authorization endpoint
   * @param redirectTo - URL to redirect after successful authentication
   */
  async initiateLogin(redirectTo: string): Promise<void> {
    // Generate PKCE code verifier and challenge
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store code verifier for later use in token exchange
    sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

    // Build authorization URL with query params
    const params = new URLSearchParams({
      redirect_to: redirectTo,
      code_challenge: codeChallenge,
    });

    // Redirect to authorization endpoint
    window.location.href = `${this.apiService.baseUrl}/auth/authorize?${params.toString()}`;
  }

  /**
   * Exchanges the authorization code for access tokens
   * @param authCode - Authorization code received from OAuth callback
   */
  async exchangeToken(authCode: string): Promise<Session> {
    const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);

    if (!codeVerifier) {
      throw new Error('Code verifier not found. Please initiate login again.');
    }

    try {
      const session = await this.apiService.post<Session>('/auth/exchange-token', {
        auth_code: authCode,
        code_verifier: codeVerifier,
      });

      this.setTokens(session.access_token, session.refresh_token);
      this.authenticated$.next(true);

      if (session.user) {
        this.currentUser$.next(session.user);
      }

      // Clear code verifier after successful exchange
      sessionStorage.removeItem(CODE_VERIFIER_KEY);

      return session;
    } catch (error) {
      sessionStorage.removeItem(CODE_VERIFIER_KEY);
      throw error;
    }
  }

  /**
   * Refreshes the access token using the refresh token
   */
  async refreshToken(): Promise<Session> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error('Refresh token not found. Please login again.');
    }

    const session = await this.apiService.post<Session>('/auth/refresh-token', {
      refresh_token: refreshToken,
    });

    this.setTokens(session.access_token, session.refresh_token);
    this.authenticated$.next(true);

    if (session.user) {
      this.currentUser$.next(session.user);
    }

    return session;
  }

  /**
   * Logs out the user by revoking the refresh token
   */
  async logout(): Promise<void> {
    try {
      await this.apiService.post<void>('/auth/logout', {});
    } finally {
      // Always clear tokens even if the API call fails
      this.clearTokens();
      this.authenticated$.next(false);
      this.currentUser$.next(null);
    }
  }

  /**
   * Gets the current authenticated user's information
   */
  async getUser(): Promise<User> {
    const user = await this.apiService.get<User>('/auth/me');
    this.currentUser$.next(user);
    return user;
  }

  /**
   * Returns the current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Checks if the user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Initializes the service by setting the auth token in ApiService
   * Call this on app initialization
   */
  initialize(): void {
    const token = this.getAccessToken();
    if (token) {
      this.apiService.setAuthToken(token);
    }
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    // Update ApiService with new token
    this.apiService.setAuthToken(accessToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(CODE_VERIFIER_KEY);
    // Clear token from ApiService
    this.apiService.setAuthToken(null);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Generates a random code verifier for PKCE
   */
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  /**
   * Generates the code challenge from the code verifier using S256 method
   */
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(new Uint8Array(hash));
  }

  /**
   * Base64 URL encodes a byte array
   */
  private base64URLEncode(array: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...array));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}
