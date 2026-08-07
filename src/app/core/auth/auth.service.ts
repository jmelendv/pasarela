import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.tokenStorage.hasToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    this.currentUserSubject = new BehaviorSubject<any>(this.tokenStorage.getUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      map(response => {
        this.tokenStorage.setToken(response.token);
        this.tokenStorage.setUser(response.user);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(response.user);
        return response;
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.tokenStorage.hasToken();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  mockLogin(email: string, password: string): Observable<LoginResponse> {
    const mockUser = {
      id: '1',
      email: email,
      name: 'Usuario Demo'
    };
    const mockToken = 'mock_token_' + Date.now();

    const response: LoginResponse = {
      token: mockToken,
      user: mockUser
    };

    this.tokenStorage.setToken(response.token);
    this.tokenStorage.setUser(response.user);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(response.user);

    return new Observable(observer => {
      observer.next(response);
      observer.complete();
    });
  }
}
