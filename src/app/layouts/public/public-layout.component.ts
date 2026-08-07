import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="public-layout">
      <header class="public-header">
        <div class="container">
          <h1>CatchToApp Pasarela</h1>
          <nav>
            <a routerLink="/">Inicio</a>
          </nav>
        </div>
      </header>
      <main class="public-main">
        <router-outlet></router-outlet>
      </main>
      <footer class="public-footer">
        <p>&copy; 2026 CatchToApp. Todos los derechos reservados.</p>
      </footer>
    </div>
  `,
  styles: [`
    .public-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .public-header {
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
      padding: 1rem 0;
    }

    .public-header .container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
    }

    .public-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .public-header nav a {
      margin-left: 1rem;
      color: #007bff;
      text-decoration: none;
    }

    .public-header nav a:hover {
      text-decoration: underline;
    }

    .public-main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem 1rem;
    }

    .public-footer {
      background-color: #f5f5f5;
      border-top: 1px solid #ddd;
      padding: 1rem;
      text-align: center;
      color: #666;
    }
  `]
})
export class PublicLayoutComponent {}
