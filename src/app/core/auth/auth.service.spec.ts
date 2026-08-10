import '@angular/compiler';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AuthService, LoginApiResponse, LoginRequest } from './auth.service';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let httpClient: { post: ReturnType<typeof vi.fn> };
  let tokenStorage: {
    hasToken: ReturnType<typeof vi.fn>;
    getUser: ReturnType<typeof vi.fn>;
    setToken: ReturnType<typeof vi.fn>;
    setUser: ReturnType<typeof vi.fn>;
    getToken: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };
  let service: AuthService;
  let storedToken: string | null;
  let storedUser: unknown;

  beforeEach(() => {
    storedToken = null;
    storedUser = null;

    httpClient = {
      post: vi.fn()
    };

    tokenStorage = {
      hasToken: vi.fn(() => storedToken !== null),
      getUser: vi.fn(() => storedUser),
      setToken: vi.fn((token: string) => {
        storedToken = token;
      }),
      setUser: vi.fn((user: unknown) => {
        storedUser = user;
      }),
      getToken: vi.fn(() => storedToken),
      clear: vi.fn(() => {
        storedToken = null;
        storedUser = null;
      })
    };

    service = new AuthService(
      httpClient as never,
      tokenStorage as unknown as TokenStorageService
    );
  });

  it('persists the session when the API returns status 200 and Mensaje OK', async () => {
    const credentials: LoginRequest = {
      username: 'usuario-demo',
      password: 'clave123'
    };
    const apiResponse: LoginApiResponse = {
      Descripcion: 'Process correct.',
      Mensaje: 'OK',
      Objeto: 'jwt-token'
    };

    httpClient.post.mockReturnValue(
      of(new HttpResponse<LoginApiResponse>({ status: 200, body: apiResponse }))
    );

    const response = await firstValueFrom(service.login(credentials));

    expect(httpClient.post).toHaveBeenCalledWith(environment.loginUrl, credentials, {
      observe: 'response'
    });
    expect(response).toEqual({
      token: 'jwt-token',
      user: {
        id: 'usuario-demo',
        username: 'usuario-demo',
        email: 'usuario-demo',
        name: 'usuario-demo'
      },
      description: 'Process correct.',
      message: 'OK'
    });
    expect(tokenStorage.setToken).toHaveBeenCalledWith('jwt-token');
    expect(tokenStorage.setUser).toHaveBeenCalledWith({
      id: 'usuario-demo',
      username: 'usuario-demo',
      email: 'usuario-demo',
      name: 'usuario-demo'
    });
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getCurrentUser()).toEqual({
      id: 'usuario-demo',
      username: 'usuario-demo',
      email: 'usuario-demo',
      name: 'usuario-demo'
    });
  });

  it('returns Descripcion when the API responds 200 but Mensaje is different from OK', async () => {
    httpClient.post.mockReturnValue(
      of(new HttpResponse<LoginApiResponse>({
        status: 200,
        body: {
          Descripcion: 'User not found.',
          Mensaje: 'ERROR',
          Objeto: ''
        }
      }))
    );

    await expect(firstValueFrom(service.login({
      username: 'usuario-demo',
      password: 'clave123'
    }))).rejects.toThrow('User not found.');

    expect(tokenStorage.clear).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('returns a service unavailable message when the API responds with an HTTP error', async () => {
    httpClient.post.mockReturnValue(
      throwError(() => new HttpErrorResponse({
        status: 503,
        statusText: 'Service Unavailable'
      }))
    );

    await expect(firstValueFrom(service.login({
      username: 'usuario-demo',
      password: 'clave123'
    }))).rejects.toThrow('El servicio no está respondiendo correctamente: el servicio no está disponible (503).');

    expect(tokenStorage.clear).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });
});
