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

    selectedImage: string | ArrayBuffer | null = null;
    imageFile : File | null = null;




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

        const formData = new FormData();

        this.loading = true;
        this.error = null;

        const sizesWithStock = this.productData.sizes.filter(size => size.stock > 0);

        formData.append('ProductName', this.productData.productName);
        formData.append('ProductReference', this.productData.productReference);
        formData.append('ProductPrice', this.productData.productPrice.toString());
        formData.append('ProductTypeId', this.productData.productTypeId.toString());

        formData.append('Sizes', JSON.stringify(
            sizesWithStock.map(size => ({
                SizeId: size.sizeId,  
                Stock: size.stock    
            }))
        ));

        if(this.imageFile) {

            formData.append('imageFile', this.imageFile);

        }
        

        this.productService.createProduct(formData).subscribe({



            next: (response) => {

                this.loading = false;
                this.resetForm();
                this.closeModal.emit();
                this.productCreated.emit();

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


        this.selectedImage = null;
        this.imageFile = null;

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

    }

    addSize(sizeId?: number): void {

        
        this.productData.sizes.push({
            sizeId: sizeId || 0,
            stock: 0
        });

    }

    removeSize(index: number): void {
        this.productData.sizes.splice(index, 1);
    }

    onSizeChange(index: number, event: any): void {
        this.productData.sizes[index].sizeId = +event.target.value;
    }

    isSizeAlreadySelected(sizeId: number, currentIndex: number): boolean {
    return this.productData.sizes.some((size, index) => 
        index !== currentIndex && size.sizeId === sizeId
    );
}


    onFileSelected(event: any):void {

        const file = event.target.files[0];
        if(file) {

            this.imageFile = file;



            const reader = new FileReader();
            reader.onload = () => {

                this.selectedImage = reader.result;

            };


            reader.readAsDataURL(file);

        }


    }
    

}