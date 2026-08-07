import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="landing-container">
      <div class="hero">
        <h1>Bienvenido a CatchToApp Pasarela</h1>
        <p>Tu pasarela de integración confiable y segura</p>
        <a routerLink="/login" class="btn-primary">Iniciar Sesión</a>
      </div>

      <div class="features">
        <div class="feature-card">
          <h3>🔒 Seguridad</h3>
          <p>Protección de datos con encriptación de nivel empresa</p>
        </div>
        <div class="feature-card">
          <h3>⚡ Rápido</h3>
          <p>Integración ágil con tu aplicación en minutos</p>
        </div>
        <div class="feature-card">
          <h3>📊 Confiable</h3>
          <p>99.9% de disponibilidad garantizada</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      padding: 0;
    }

    .hero {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .hero h1 {
      margin: 0 0 1rem 0;
      font-size: 2.5rem;
    }

    .hero p {
      margin: 0 0 1.5rem 0;
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .btn-primary {
      display: inline-block;
      background-color: white;
      color: #007bff;
      padding: 0.75rem 2rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: scale(1.05);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }

    .feature-card h3 {
      margin-top: 0;
      color: #007bff;
    }

    .feature-card p {
      margin-bottom: 0;
      color: #666;
    }
  `]
})
export class LandingComponent {}
