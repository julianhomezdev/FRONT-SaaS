import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProductUseCases } from "../../../domain/usecases/product.usecases";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productUseCases: ProductUseCases,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProductData();
      }
    });
  }

  loadProductData(): void {
    if (this.productId) {
      this.loading = true;
      
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const productData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      
    } else {
      this.productUseCases.createProduct(productData).subscribe({
        next: () => {
          this.handleSuccess('Producto creado exitosamente');
        },
        error: (err) => {
          this.handleError(err, 'Error al crear el producto');
        }
      });
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleSuccess(message: string): void {
    this.loading = false;
    this.router.navigate(['/products']);
  }

  private handleError(err: any, defaultMessage: string): void {
    this.error = err.error?.message || defaultMessage;
    this.loading = false;
    console.error('Error:', err);
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  get formControls() {
    return this.productForm.controls;
  }
}