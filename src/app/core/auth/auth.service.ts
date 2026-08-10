import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface LoginApiResponse {
  Descripcion: string;
  Mensaje: string;
  Objeto: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  description: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = environment.loginUrl;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser$: Observable<AuthUser | null>;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.tokenStorage.hasToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(this.tokenStorage.getUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginApiResponse>(this.loginUrl, credentials, { observe: 'response' }).pipe(
      map((response: HttpResponse<LoginApiResponse>) => {
        if (response.status !== 200) {
          this.clearSessionState();
          throw new Error(this.buildServiceUnavailableMessage(response.status, response.statusText));
        }

        const body = response.body;

        if (!body) {
          this.clearSessionState();
          throw new Error('El servicio no está respondiendo: la respuesta llegó vacía.');
        }

        if (!this.isSuccessfulLogin(body)) {
          this.clearSessionState();
          throw new Error(this.buildAuthenticationFailedMessage(body.Descripcion));
        }

        const loginResponse: LoginResponse = {
          token: body.Objeto,
          user: this.buildAuthenticatedUser(credentials.username),
          description: body.Descripcion,
          message: body.Mensaje
        };

        this.persistSession(loginResponse);

        return loginResponse;
      }),
      catchError((error: unknown) => {
        this.clearSessionState();

        if (error instanceof HttpErrorResponse) {
          const apiErrorDescription = this.extractApiErrorDescription(error.error);

          if (error.status === 200 && apiErrorDescription) {
            return throwError(() => new Error(this.buildAuthenticationFailedMessage(apiErrorDescription)));
          }

          return throwError(() => new Error(this.buildServiceUnavailableMessage(error.status, error.statusText)));
        }

        if (error instanceof Error) {
          return throwError(() => error);
        }

        return throwError(() => new Error('No se pudo completar el inicio de sesión.'));
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

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  private persistSession(response: LoginResponse): void {
    this.tokenStorage.setToken(response.token);
    this.tokenStorage.setUser(response.user);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(response.user);
  }

  private clearSessionState(): void {
    this.tokenStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private isSuccessfulLogin(response: LoginApiResponse): boolean {
    return response.Mensaje.trim().toUpperCase() === 'OK';
  }

  private buildAuthenticationFailedMessage(description: string): string {
    return description;
  }

  private buildAuthenticatedUser(username: string): AuthUser {
    return {
      id: username,
      username,
      email: username,
      name: username
    };
  }

  private buildServiceUnavailableMessage(status: number, statusText: string): string {
    switch (status) {
      case 0:
        return 'El servicio no está respondiendo: no fue posible establecer conexión con el servidor.';
      case 400:
        return 'El servicio no está respondiendo correctamente: la solicitud fue inválida (400).';
      case 401:
        return 'El servicio no está respondiendo correctamente: el servicio devolvió no autorizado (401).';
      case 403:
        return 'El servicio no está respondiendo correctamente: el acceso fue denegado por el servicio (403).';
      case 404:
        return 'El servicio no está respondiendo correctamente: no se encontró el endpoint de login (404).';
      case 405:
        return 'El servicio no está respondiendo correctamente: el método POST no está permitido (405).';
      case 500:
        return 'El servicio no está respondiendo correctamente: ocurrió un error interno en el servidor (500).';
      case 502:
        return 'El servicio no está respondiendo correctamente: el servidor devolvió una puerta de enlace inválida (502).';
      case 503:
        return 'El servicio no está respondiendo correctamente: el servicio no está disponible (503).';
      case 504:
        return 'El servicio no está respondiendo correctamente: el servidor agotó el tiempo de espera (504).';
      default:
        return `El servicio no está respondiendo correctamente: devolvió el estado ${status}${statusText ? ` (${statusText})` : ''}.`;
    }
  }

  private extractApiErrorDescription(errorBody: unknown): string | null {
    if (!errorBody) {
      return null;
    }

    if (typeof errorBody === 'string') {
      try {
        const parsedBody = JSON.parse(errorBody) as Partial<LoginApiResponse>;
        return typeof parsedBody.Descripcion === 'string' ? parsedBody.Descripcion : null;
      } catch {
        return null;
      }
    }

    if (typeof errorBody === 'object' && errorBody !== null && 'Descripcion' in errorBody) {
      const description = (errorBody as { Descripcion?: unknown }).Descripcion;
      return typeof description === 'string' ? description : null;
    }

    return null;
  }
}
