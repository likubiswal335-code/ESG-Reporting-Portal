/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const TOKEN_KEY = 'meil_mgmt_session_token_v1';
const USER_KEY = 'meil_mgmt_user_v1';

export interface AuthUser {
  userId: string;
  name: string;
  role: 'MANAGEMENT_ADMIN' | string;
  department?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
  expiresAt: number;
}

class ApiService {
  private token: string | null = null;
  private user: AuthUser | null = null;
  private onUnauthorizedCallback: (() => void) | null = null;

  constructor() {
    // Restore session token if valid
    this.token = sessionStorage.getItem(TOKEN_KEY);
    const storedUser = sessionStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch {
        this.user = null;
      }
    }
  }

  public setOnUnauthorized(callback: () => void) {
    this.onUnauthorizedCallback = callback;
  }

  public getToken(): string | null {
    return this.token;
  }

  public getUser(): AuthUser | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return !!this.token && this.user?.role === 'MANAGEMENT_ADMIN';
  }

  private handleUnauthorized() {
    this.clearSession();
    if (this.onUnauthorizedCallback) {
      this.onUnauthorizedCallback();
    }
  }

  public saveSession(token: string, user: AuthUser) {
    this.token = token;
    this.user = user;
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public clearSession() {
    this.token = null;
    this.user = null;
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  // HTTP Helper with Bearer token
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(endpoint, {
        ...options,
        headers,
      });

      if (res.status === 401) {
        this.handleUnauthorized();
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Your session has expired. Please sign in again.');
      }

      if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Unauthorized Management Access.');
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      return (await res.json()) as T;
    } catch (err: any) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Unable to connect to the reporting system. Please try again.');
      }
      throw err;
    }
  }

  // Auth Endpoints
  public async login(userId: string, password: string): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId, password }),
    });

    if (data.token && data.user) {
      this.saveSession(data.token, data.user);
    }

    return data;
  }

  public async checkSession(): Promise<{ authenticated: boolean; user?: AuthUser }> {
    if (!this.token) {
      return { authenticated: false };
    }

    try {
      const data = await this.request<{ authenticated: boolean; user: AuthUser }>('/api/auth/session');
      if (data.user) {
        this.user = data.user;
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
      return data;
    } catch {
      this.clearSession();
      return { authenticated: false };
    }
  }

  public async logout(): Promise<void> {
    try {
      if (this.token) {
        await this.request('/api/auth/logout', { method: 'POST' });
      }
    } finally {
      this.clearSession();
    }
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // ESG Audit Logging to Server
  public async logAudit(payload: {
    action: string;
    module: string;
    entity: string;
    recordId: string;
    previousValue?: any;
    newValue?: any;
    details?: string;
  }): Promise<void> {
    if (!this.token) return;
    try {
      await this.request('/api/esg/audit-entry', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Failed to send audit entry to server:', err);
    }
  }

  public async getAuditLogs(): Promise<{ auditLogs: any[] }> {
    return this.request('/api/esg/audit');
  }

  public async resetDatabase(): Promise<{ message: string }> {
    return this.request('/api/esg/reset-database', { method: 'POST' });
  }
}

export const api = new ApiService();
