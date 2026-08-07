import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <h1>Mi Perfil</h1>

      <div *ngIf="currentUser$ | async as user" class="profile-card">
        <div class="profile-header">
          <div class="avatar">{{ user.name?.charAt(0).toUpperCase() }}</div>
          <div class="user-info">
            <h2>{{ user.name }}</h2>
            <p>{{ user.email }}</p>
          </div>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" class="profile-form">
          <div class="form-group">
            <label for="name">Nombre:</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-control"
              [disabled]="true"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 0;
    }

    .profile-container h1 {
      color: #333;
      margin-bottom: 2rem;
    }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      max-width: 600px;
    }

    .profile-header {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      flex-shrink: 0;
    }

    .user-info h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .user-info p {
      margin: 0;
      color: #666;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.1);
    }

    .form-control:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-save {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .btn-save:hover {
      background-color: #0056b3;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const user = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      name: [user?.name || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]]
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    console.log('Perfil actualizado:', this.profileForm.value);
    alert('Perfil actualizado correctamente (demo)');
  }
}
