import { Component, EventEmitter, inject, Output } from "@angular/core";
import { ExportRepository } from "../../../domain/repositories/export.repository";
import { ExportMetricsUseCase } from "../../../domain/usecases/export.usecases";
import { ExportRepositoryImpl } from "../../../domain/repositories/export.repository.impl";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { DateRange } from "../../../core/models/date-range.model";

@Component({

  selector: 'export-metrics',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  styleUrl: './export-metrics.component.css',
  templateUrl: './export-metrics.component.html',
  providers: [
    { provide: ExportRepository, useClass: ExportRepositoryImpl }
  ]


})

export default class ExportMetrics {

  private exportUseCase: ExportMetricsUseCase;
  @Output() closeModal = new EventEmitter<void>();
  
  startDate: string = '';
  endDate: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor() {
    const repository = inject(ExportRepository);
    this.exportUseCase = new ExportMetricsUseCase(repository);
  }

  onClose(): void {
    this.closeModal.emit();
  }

  async onExport(): Promise<void> {
    this.clearMessages();

    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Por favor selecciona ambas fechas';
      return;
    }

    this.isLoading = true;

    try {
      const dateRange: DateRange = {
        startDate: new Date(this.startDate),
        endDate: new Date(this.endDate)
      };

      const blob = await this.exportUseCase.execute(dateRange);
      this.downloadFile(blob);
      this.successMessage = '¡Exportación exitosa!';
      
      setTimeout(() => this.clearMessages(), 3000);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Error al exportar métricas';
    } finally {
      this.isLoading = false;
    }
  }

  private downloadFile(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metrics-${this.startDate}-${this.endDate}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  get maxDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}