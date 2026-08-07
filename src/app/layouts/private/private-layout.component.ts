import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="private-layout">
      <header class="private-header">
        <div class="container">
          <h1>CatchToApp Pasarela</h1>
          <nav class="nav-menu">
            <a routerLink="/app/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/app/profile" routerLinkActive="active">Perfil</a>
            <span class="user-info">{{ (currentUser$ | async)?.name }}</span>
            <button (click)="logout()" class="logout-btn">Cerrar sesión</button>
          </nav>
        </div>
      </header>
      <main class="private-main">
        <router-outlet></router-outlet>
      </main>
      <footer class="private-footer">
        <p>&copy; 2026 CatchToApp. Todos los derechos reservados.</p>
      </footer>
    </div>
  `,
  styles: [`
    .private-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .private-header {
      background-color: #007bff;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .private-header .container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
    }

    .private-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      text-decoration: underline;
    }

    .user-info {
      color: #e0e0e0;
      font-size: 0.9rem;
    }

    .logout-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .logout-btn:hover {
      background-color: #c82333;
    }

    .private-main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem 1rem;
    }

    .private-footer {
      background-color: #f5f5f5;
      border-top: 1px solid #ddd;
      padding: 1rem;
      text-align: center;
      color: #666;
    }
  `]
})
export class PrivateLayoutComponent implements OnInit {
  currentUser$: Observable<any>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
