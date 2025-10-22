// src/app/presentation/products/product-list/product-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductUseCases } from '../../../domain/usecases/product.usecases';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productUseCases: ProductUseCases,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
   
  }

  onEdit(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  onCreate(): void {
    this.router.navigate(['/products/create']);
  }

  

  onViewDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }
}