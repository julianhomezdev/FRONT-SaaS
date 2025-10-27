import { CommonModule } from "@angular/common";
import { Component, Output, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EventEmitter } from "@angular/core";
import { ProductApiService } from "../../../core/services/product-api.service";
import { FormsModule } from "@angular/forms";
import { Size } from "../../../core/models/size.model";

@Component({

    selector: 'create-product',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    styleUrl: './create-product.component.css',
    templateUrl: './create-product.component.html'


})


export default class CreateProductComponent implements OnInit {

    @Output() productCreated = new EventEmitter<void>();
    @Output() closeModal = new EventEmitter<void>();



    productData = {


        productName: '',
        productReference: '',
        productPrice: 0,
        productTypeId: 1,
        sizes: [] as {sizeId: number, stock: number}[]


    };

    availableSizes: Size[] = [];
    loadingSizes: boolean = false;


    loading: boolean = false;
    error: string | null = null;

    constructor(private productService: ProductApiService) {}


    ngOnInit(): void {

        this.loadSizes();

    }

    onSubmit(): void {

        this.loading = true;
        this.error = null;

        const sizesWithStock = this.productData.sizes.filter(size => size.stock > 0);


        const productToSend = {
            productName: this.productData.productName,
            productReference: this.productData.productReference,
            productPrice: this.productData.productPrice,
            productTypeId: this.productData.productTypeId,
            sizes: sizesWithStock  
        };

        this.productService.createProduct(productToSend).subscribe({



            next: (response) => {

                this.loading = false;
                this.productCreated.emit();
                this.resetForm();

            },

            error: (err) => {

                this.loading = false;
                this.error = 'Error al crear el producto';
                console.error(err);

            }

        });

    }


    onCancel(): void {

        this.closeModal.emit();
        this.resetForm();

    }

    loadSizes(): void {
        this.loadingSizes = true;
        this.productService.getSizes().subscribe({
            next: (sizes) => {
                this.availableSizes = sizes;
                this.loadingSizes = false;
            },
            error: (err) => {
                console.error('Error cargando tallas:', err);
                this.loadingSizes = false;
             
            }
        });
    }

    private resetForm(): void {


        this.productData = {

            productName: '',
            productReference: '',
            productPrice: 0,
            productTypeId: 1,
            sizes: [] as {sizeId: number, stock: number}[]


        };

    }

    addSize(): void {

        this.productData.sizes.push({
            sizeId: 1,
            stock: 0
        })

    }

    removeSize(index: number): void {
        this.productData.sizes.splice(index, 1);
    }
    

}