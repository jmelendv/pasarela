import '@angular/compiler';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let authService: Pick<AuthService, 'login'>;
  let router: Pick<Router, 'navigate'>;
  let cdr: Pick<ChangeDetectorRef, 'detectChanges'>;
  let component: LoginComponent;

  beforeEach(() => {
    authService = {
      login: vi.fn()
    };

    router = {
      navigate: vi.fn()
    };

    cdr = {
      detectChanges: vi.fn()
    };

    component = new LoginComponent(
      new FormBuilder(),
      authService as AuthService,
      router as Router,
      cdr as ChangeDetectorRef
    );

    component.ngOnInit();
  });

  afterEach(() => {
    component.ngOnDestroy();
    vi.useRealTimers();
  });

  it('shows a warning popup when the form is invalid', () => {
    component.onLogin();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Ingresa tu usuario y una contraseña válida para continuar.');
    expect(component.popupType).toBe('warning');
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('shows the backend error in the popup and hides it after 3 seconds', () => {
    vi.useFakeTimers();
    vi.mocked(authService.login).mockReturnValue(throwError(() => new Error('User not found.')));

    component.loginForm.setValue({
      username: 'usuario-demo',
      password: 'clave123'
    });

    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith({
      username: 'usuario-demo',
      password: 'clave123'
    });
    expect(component.errorMessage).toBe('User not found.');
    expect(component.popupType).toBe('error');
    expect(router.navigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3000);

    expect(component.errorMessage).toBe('');
  });

  it('shows a success popup and redirects after 3 seconds on successful login', () => {
    vi.useFakeTimers();
    vi.mocked(authService.login).mockReturnValue(of({
      token: 'jwt-token',
      user: {
        id: '1',
        username: 'usuario-demo',
        email: 'usuario-demo',
        name: 'usuario-demo'
      },
      description: 'Process correct.',
      message: 'OK'
    }));

    component.loginForm.setValue({
      username: 'usuario-demo',
      password: 'clave123'
    });

    component.onLogin();

    expect(component.errorMessage).toBe('Autenticación exitosa');
    expect(component.popupType).toBe('success');
    expect(router.navigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3000);

    expect(router.navigate).toHaveBeenCalledWith(['/app/dashboard']);
    expect(component.errorMessage).toBe('');
  });
});
