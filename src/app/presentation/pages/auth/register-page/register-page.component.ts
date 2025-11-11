import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";

@Component({

    selector: 'RegisterPage',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './register-page.component.html',
    styleUrl: './register-page.component.css'

})


export default class RegisterComponent  {


 email = '';
  identificationNumber = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.email || !this.identificationNumber || !this.password) {
      this.errorMessage = 'Por favor complete todos los campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .register({
        email: this.email,
        identificationNumber: this.identificationNumber,
        password: this.password
      })
      .subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Error al registrar. Intente nuevamente.';
          this.loading = false;
        }
      });
  }

}