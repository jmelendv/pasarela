import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <p>Bienvenido, {{ (currentUser$ | async)?.name }}!</p>

      <div class="cards-grid">
        <div class="card">
          <h3>📊 Estadísticas</h3>
          <p class="stat-number">1,234</p>
          <p class="stat-label">Transacciones totales</p>
        </div>

        <div class="card">
          <h3>✅ Exitosas</h3>
          <p class="stat-number">1,100</p>
          <p class="stat-label">En el último mes</p>
        </div>

        <div class="card">
          <h3>⚠️ Pendientes</h3>
          <p class="stat-number">34</p>
          <p class="stat-label">Requieren atención</p>
        </div>

        <div class="card">
          <h3>🔄 Integraciones</h3>
          <p class="stat-number">8</p>
          <p class="stat-label">Conectadas</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
    }

    .dashboard-container h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .dashboard-container > p {
      color: #666;
      margin-bottom: 2rem;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid #007bff;
    }

    .card h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #333;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
      margin: 0.5rem 0;
    }

    .stat-label {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<any>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}
}
