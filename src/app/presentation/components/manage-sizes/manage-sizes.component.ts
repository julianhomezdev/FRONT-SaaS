// src/app/presentation/components/manage-sizes/manage-sizes.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Size } from '../../../core/models/size.model';
import { SizeApiService } from '../../../core/services/size-api.service';

@Component({
  selector: 'manage-sizes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-sizes.component.html',
  styleUrl: './manage-sizes.component.css'
})
export default class ManageSizesComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() sizeCreated = new EventEmitter<void>();

  sizes: Size[] = [];
  newSizeName: string = '';
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private sizeApiService: SizeApiService) { }

  ngOnInit(): void {
    this.loadSizes();
  }

  loadSizes(): void {
    this.loading = true;
    this.sizeApiService.getAllSizes().subscribe({
      next: (sizes) => {
        this.sizes = sizes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las tallas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createSize(): void {
    if (!this.newSizeName.trim()) {
      this.error = 'El nombre de la talla es requerido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.sizeApiService.createSize(this.newSizeName.trim()).subscribe({
      next: (response) => {
        this.successMessage = 'Talla creada exitosamente';
        this.newSizeName = '';
        this.loadSizes();
        this.sizeCreated.emit();
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.error = 'Error al crear la talla';
        this.loading = false;
        console.error(err);
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.createSize();
  }
}