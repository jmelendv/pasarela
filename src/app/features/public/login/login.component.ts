import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private static readonly POPUP_DURATION_MS = 3000;

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  popupType: 'error' | 'warning' | 'success' = 'error';
  private errorPopupTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private redirectTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.clearErrorPopupTimeout();
    this.clearRedirectTimeout();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.showPopup('Ingresa tu usuario y una contraseña válida para continuar.', 'warning');
      return;
    }

    this.isLoading = true;
    this.clearErrorPopup();

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login({ username, password })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.showPopup('Autenticación exitosa', 'success');
          this.clearRedirectTimeout();
          this.redirectTimeoutId = setTimeout(() => {
            this.redirectTimeoutId = null;
            this.router.navigate(['/app/dashboard']);
          }, LoginComponent.POPUP_DURATION_MS);
        },
        error: (error: Error) => {
          this.showPopup(error.message || 'No se pudo iniciar sesión.', 'error');
        }
      });
  }

  private showPopup(message: string, type: 'error' | 'warning' | 'success'): void {
    this.errorMessage = message;
    this.popupType = type;
    this.clearErrorPopupTimeout();
    this.cdr.detectChanges();
    this.errorPopupTimeoutId = setTimeout(() => {
      this.errorMessage = '';
      this.errorPopupTimeoutId = null;
      this.cdr.detectChanges();
    }, LoginComponent.POPUP_DURATION_MS);
  }

  private clearErrorPopup(): void {
    this.errorMessage = '';
    this.popupType = 'error';
    this.clearErrorPopupTimeout();
    this.cdr.detectChanges();
  }

  private clearErrorPopupTimeout(): void {
    if (this.errorPopupTimeoutId !== null) {
      clearTimeout(this.errorPopupTimeoutId);
      this.errorPopupTimeoutId = null;
    }
  }

  private clearRedirectTimeout(): void {
    if (this.redirectTimeoutId !== null) {
      clearTimeout(this.redirectTimeoutId);
      this.redirectTimeoutId = null;
    }
  }
}
