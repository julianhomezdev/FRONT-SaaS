import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface InvoiceItem {
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

@Component({
    selector: 'create-invoice',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-invoice.component.html',
    styleUrl: './create-invoice.component.css'
})
export default class CreateInvoiceComponent {
    @Output() closeModal = new EventEmitter<void>();

    invoiceNumber: string = this.generateInvoiceNumber();
    customerName: string = '';
    customerDocument: string = '';
    date: Date = new Date();

    productName: string = '';
    quantity: number = 1;
    unitPrice: number = 0;

    items: InvoiceItem[] = [];
    subtotal: number = 0;
    tax: number = 0;
    total: number = 0;

    generateInvoiceNumber(): string {
        const date = new Date();
        return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`;
    }

    addItem(): void {
        if (!this.productName || this.quantity <= 0 || this.unitPrice <= 0) {
            alert('Completa todos los campos del producto');
            return;
        }

        const item: InvoiceItem = {
            productName: this.productName,
            quantity: this.quantity,
            unitPrice: this.unitPrice,
            total: this.quantity * this.unitPrice
        };

        this.items.push(item);
        this.calculateTotals();
        
        this.productName = '';
        this.quantity = 1;
        this.unitPrice = 0;
    }

    removeItem(index: number): void {
        this.items.splice(index, 1);
        this.calculateTotals();
    }

    calculateTotals(): void {
        this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
        this.tax = this.subtotal * 0.19;
        this.total = this.subtotal + this.tax;
    }

    printInvoice(): void {
        if (!this.customerName || !this.customerDocument) {
            alert('Completa los datos del cliente');
            return;
        }

        if (this.items.length === 0) {
            alert('Agrega al menos un producto');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Factura ${this.invoiceNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .info { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .totals { text-align: right; margin-top: 20px; }
                    .totals div { margin: 5px 0; }
                    .total-final { font-weight: bold; font-size: 1.2em; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>FACTURA DE VENTA</h1>
                    <h2>${this.invoiceNumber}</h2>
                </div>
                <div class="info">
                    <p><strong>Cliente:</strong> ${this.customerName}</p>
                    <p><strong>Documento:</strong> ${this.customerDocument}</p>
                    <p><strong>Fecha:</strong> ${new Date(this.date).toLocaleDateString('es-CO')}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.items.map(item => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.unitPrice.toLocaleString('es-CO')}</td>
                                <td>$${item.total.toLocaleString('es-CO')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="totals">
                    <div>Subtotal: $${this.subtotal.toLocaleString('es-CO')}</div>
                    <div>IVA (19%): $${this.tax.toLocaleString('es-CO')}</div>
                    <div class="total-final">TOTAL: $${this.total.toLocaleString('es-CO')}</div>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    close(): void {
        this.closeModal.emit();
    }
}