import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductApiService } from "../../../core/services/product-api.service";
import { Product } from "../../../core/models/product.model";
import { setTimeout } from "timers/promises";


interface InvoiceItem {
    productId: number;
    productName: string;
    productReference: string;
    sizeId: number;
    sizeName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    availableStock: number;
}

@Component({
    selector: 'create-invoice',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-invoice.component.html',
    styleUrl: './create-invoice.component.css'
})
export default class CreateInvoiceComponent implements OnInit {
    @Output() closeModal = new EventEmitter<void>();
    @Output() invoiceCreated = new EventEmitter<void>();

    invoiceNumber: string = this.generateInvoiceNumber();
    customerName: string = '';
    customerDocument: string = '';
    date: Date = new Date();

    products: Product[] = [];
    selectedProduct: Product | null = null;
    selectedProductId: number = 0;
    selectedSizeId: number = 0;
    quantity: number = 1;

    items: InvoiceItem[] = [];
    subtotal: number = 0;
    tax: number = 0;
    total: number = 0;

    isEditingTotal: boolean = false;
    tempTotal: number = 0;

    loading: boolean = false;
    loadingProducts: boolean = false;
    error: string | null = null;

    constructor(private productService: ProductApiService) { }

    ngOnInit(): void {
        this.loadProducts();
    }


    startEditingTotal(): void {


        this.isEditingTotal= true;
        this.tempTotal = this.total;
    }


    cancelEditingTotal(): void {

        this.isEditingTotal = false;
        this.tempTotal = 0;

    }

    saveEditedTotal(): void {
        if (this.tempTotal <= 0) {
            alert('El total debe ser mayor a 0');
            return;
        }

        if (this.tempTotal < this.subtotal) {
            alert('El total no puede ser menor al subtotal');
            return;
        }

        this.total = this.tempTotal;
        this.tax = this.total - this.subtotal;
        this.isEditingTotal = false;
    }


    generateInvoiceNumber(): string {
        const date = new Date();
        return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`;
    }

    loadProducts(): void {
        this.loadingProducts = true;
        this.productService.getAllProducts().subscribe({
            next: (products) => {


                this.products = products;
                this.loadingProducts = false;
            },
            error: (err) => {
                console.error('Error cargando productos:', err);
                this.error = 'Error al cargar productos';
                this.loadingProducts = false;
            }
        });
    }

    onProductChange(): void {
        this.selectedProduct = this.products.find(p => p.id === +this.selectedProductId) || null;
        this.selectedSizeId = 0;
        this.quantity = 1;
    }

    getAvailableStock(): number {
        if (!this.selectedProduct || !this.selectedSizeId) return 0;
        const size = this.selectedProduct.sizes.find(s => s.sizeId === +this.selectedSizeId);
        return size ? size.sizeStock : 0;
    }

    addItem(): void {
        if (!this.selectedProduct || !this.selectedSizeId || this.quantity <= 0) {
            alert('Selecciona un producto, talla y cantidad válida');
            return;
        }

        const size = this.selectedProduct.sizes.find(s => s.sizeId === +this.selectedSizeId);
        if (!size) {
            alert('Talla no encontrada');
            return;
        }

        if (this.quantity > size.sizeStock) {
            alert(`Stock insuficiente. Disponible: ${size.sizeStock}`);
            return;
        }

        const existingItem = this.items.find(
            item => item.productId === this.selectedProduct!.id && item.sizeId === +this.selectedSizeId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + this.quantity;
            if (newQuantity > size.sizeStock) {
                alert(`Stock insuficiente. Disponible: ${size.sizeStock}`);
                return;
            }
            existingItem.quantity = newQuantity;
            existingItem.total = existingItem.quantity * existingItem.unitPrice;
        } else {
            const item: InvoiceItem = {
                productId: this.selectedProduct.id!,
                productName: this.selectedProduct.productName,
                productReference: this.selectedProduct.productReference,
                sizeId: +this.selectedSizeId,
                sizeName: size?.sizeName || 'Sin nombre',
                quantity: this.quantity,
                unitPrice: this.selectedProduct.productPrice,
                total: this.quantity * this.selectedProduct.productPrice,
                availableStock: size.sizeStock
            };
            this.items.push(item);
        }

        this.calculateTotals();
        this.selectedProductId = 0;
        this.selectedProduct = null;
        this.selectedSizeId = 0;
        this.quantity = 1;
    }


    updateTotal(newTotal: number): void {
    if (newTotal < this.subtotal) {
        alert('El total no puede ser menor al subtotal');
        this.total = this.subtotal + this.tax;
        return;
    }
    
    this.total = newTotal;
    this.tax = this.total - this.subtotal;
}

    removeItem(index: number): void {
        this.items.splice(index, 1);
        this.calculateTotals();
    }

    calculateTotals(): void {

        this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
        //this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
        this.tax = this.subtotal * 0.19;
        this.total = this.subtotal + this.tax;
    }

    createInvoice(): void {
        if (!this.customerName || !this.customerDocument) {
            alert('Completa los datos del cliente');
            return;
        }

        if (this.items.length === 0) {
            alert('Agrega al menos un producto');
            return;
        }

        this.loading = true;
        this.error = null;

        const invoiceData = {
            invoiceNumber: this.invoiceNumber,
            customerName: this.customerName,
            customerDocument: this.customerDocument,
            date: this.date.toISOString(),
            items: this.items.map(item => ({
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total
            })),
            subtotal: this.subtotal,
            tax: this.tax,
            total: this.total
        };

         this.productService.createInvoice(invoiceData).subscribe({
        next: (response) => {
            this.loading = false;
            this.printInvoice();
            
            window.setTimeout(() => {
            this.invoiceCreated.emit();
            this.close();
        }, 500);
        },
        error: (err) => {
            this.loading = false;
            this.error = 'Error al crear la factura';
            console.error(err);
        }
    });
}

    printInvoice(): void {
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
                        <th>Referencia</th>
                        <th>Producto</th>
                        <th>Talla</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.items.map(item => `
                        <tr>
                            <td>${item.productReference}</td>
                            <td>${item.productName}</td>
                            <td>${item.sizeName}</td>
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
    window.setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

    close(): void {
        this.closeModal.emit();
    }
}