// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1>Sistema de Gestión de Productos</h1>
          <p>Inventario y Control de Stock</p>
        </div>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer">
        <p>&copy; 2025 Sistema de Inventario</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f7fa;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .header-content h1 {
      margin: 0 0 5px 0;
      font-size: 28px;
    }

    .header-content p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .app-main {
      flex: 1;
      padding: 20px 0;
    }

    .app-footer {
      background: #2c3e50;
      color: white;
      text-align: center;
      padding: 15px;
      margin-top: auto;
    }

    .app-footer p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class AppComponent {
  title = 'FRONT_SAAS';
}