import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({

    selector: 'login-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css'

})

export default class LoginPageComponent {

identificationNumber = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.identificationNumber || !this.password) {
      this.errorMessage = 'Por favor complete todos los campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login({
        identificationNumber: this.identificationNumber,
        password: this.password
      })
      .subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Credenciales inválidas';
          this.loading = false;
        }
      });
  }




}