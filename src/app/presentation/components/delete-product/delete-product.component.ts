import { CommonModule } from "@angular/common";
import { Component, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EventEmitter } from "@angular/core";
import { Product } from "../../../core/models/product.model";
import { ProductApiService } from "../../../core/services/product-api.service";

@Component({

    selector: 'delete-product',
    standalone: true,
    imports: [CommonModule, FormsModule],
    styleUrl: './delete-product.component.css',
    templateUrl: './delete-product.component.html'

})


export default class DeleteProductComponent implements OnInit {


    @Output() productDeleted = new EventEmitter<void>();
    @Output() closeModal = new EventEmitter<void>();

    products: Product[] = [];
    selectedProductId: number | null = null;
    loading: boolean = false;
    loadingProducts : boolean = false;
    error: string | null = null;

    constructor(private productService: ProductApiService) {}


    ngOnInit(): void {

        this.loadAllProducts();

    }


    loadAllProducts(): void {

        this.loadingProducts = true;
        this.productService.getAllProducts(100, 1, undefined).subscribe({


            next: (products) => {

                this.products = products;
                this.loadingProducts = false;
            },
            error: (err) => {

                this.error = 'Error cargando productos';
                this.loadingProducts = false;
                console.error(err);

            }


        });


    }


    onDelete(): void {

        if(!this.selectedProductId) {


            this.error = "Por favor selecciona un producto";
            return;

        }


        


        if (!confirm('¿Estas seguro que deseas eliminar este producto?')) {

            return;

        } 

        this.loading = true;
        this.error = null;

    }

    onCancel(): void {

        this.closeModal.emit();

    }

   getSelectedProduct(): Product | undefined {
    console.log('Selected ID:', this.selectedProductId, 'Type:', typeof this.selectedProductId);
    
    if (!this.selectedProductId) return undefined;
    
    return this.products.find(p => p.id === this.selectedProductId);
}
}