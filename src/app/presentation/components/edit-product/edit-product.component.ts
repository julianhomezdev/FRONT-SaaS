import { CommonModule } from "@angular/common";
import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductApiService } from "../../../core/services/product-api.service";
import { Product, ProductsSizes } from "../../../core/models/product.model";
import { Size } from "../../../core/models/size.model";

@Component({
    selector: 'edit-product',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-product.component.html',
    styleUrl: './edit-product.component.css'
})
export default class EditProductComponent implements OnInit {

    @Output() productUpdated = new EventEmitter<void>();
    @Output() closeModal = new EventEmitter<void>();

    products: Product[] = [];
    availableSizes: Size[] = [];
    selectedProductId: string = '';  // Cambiar a string
    editedProduct: any = null;

    loading: boolean = false;
    loadingProducts: boolean = false;
    loadingSizes: boolean = false;
    error: string | null = null;

    constructor(private productService: ProductApiService) { }

    ngOnInit(): void {
        this.loadAllProducts();
        this.loadSizes();
    }

    loadAllProducts(): void {
        this.loadingProducts = true;
        this.productService.getAllProducts(100, 1, undefined).subscribe({
            next: (products) => {
                this.products = products;
                console.log('Productos cargados:', products);
                this.loadingProducts = false;
            },
            error: (err) => {
                this.error = 'Error cargando productos';
                this.loadingProducts = false;
                console.error(err);
            }
        });
    }

    loadSizes(): void {
        this.loadingSizes = true;
        this.productService.getSizes().subscribe({
            next: (sizes) => {
                this.availableSizes = sizes;
                console.log('Tallas cargadas:', sizes);
                this.loadingSizes = false;
            },
            error: (err) => {
                console.error('Error cargando tallas:', err);
                this.loadingSizes = false;
            }
        });
    }

    onProductSelect(): void {
        console.log('ID seleccionado:', this.selectedProductId);
        
        if (this.selectedProductId) {
            const product = this.products.find(p => p.id === Number(this.selectedProductId));
            console.log('Producto encontrado:', product);
            
            if (product) {
                // Mapear correctamente usando sizeStock del modelo
                this.editedProduct = {
                    id: product.id,
                    productName: product.productName,
                    productReference: product.productReference,
                    productPrice: product.productPrice,
                    productTypeId: product.productTypeId || 1,
                    sizes: product.sizes ? product.sizes.map(ps => ({
                        sizeId: ps.sizeId,
                        stock: ps.sizeStock  // Mapear sizeStock a stock para el formulario
                    })) : []
                };
                console.log('Producto preparado para editar:', this.editedProduct);
            }
        } else {
            this.editedProduct = null;
        }
    }

    addSize(): void {
        if (this.editedProduct) {
            this.editedProduct.sizes.push({
                sizeId: '',
                stock: 0
            });
        }
    }

    removeSize(index: number): void {
        if (this.editedProduct) {
            this.editedProduct.sizes.splice(index, 1);
        }
    }

    getAvailableSizesForSelection(currentIndex: number): Size[] {
        if (!this.editedProduct) return this.availableSizes;

        return this.availableSizes.filter(availableSize =>
            !this.editedProduct.sizes.some((size: any, index: number) =>
                index !== currentIndex && size.sizeId === availableSize.id
            )
        );
    }

    onSave(): void {
    if (!this.editedProduct) return;

    // Validar campos requeridos
    if (!this.editedProduct.productName?.trim() || !this.editedProduct.productReference?.trim()) {
        this.error = 'Complete todos los campos requeridos (Nombre y Referencia)';
        return;
    }

    this.loading = true;
    this.error = null;

    // Filtrar y preparar las tallas
    // Si el stock es 0, NO lo enviamos (esto "elimina" la talla)
    // Solo enviamos tallas con sizeId válido y stock > 0
    const sizesArray = this.editedProduct.sizes
        .filter((s: any) => s.sizeId && s.sizeId !== '' && s.stock > 0)
        .map((s: any) => ({
            SizeId: Number(s.sizeId),
            Stock: Number(s.stock)
        }));

    const updateData = {
        ProductName: this.editedProduct.productName.trim(),
        ProductReference: this.editedProduct.productReference.trim(),
        ProductPrice: Number(this.editedProduct.productPrice),
        ProductTypeId: Number(this.editedProduct.productTypeId),
        Sizes: JSON.stringify(sizesArray)
    };

    console.log('=== DEBUG UPDATE ===');
    console.log('Producto ID:', this.editedProduct.id);
    console.log('Datos a enviar:', updateData);
    console.log('Sizes array:', sizesArray);
    console.log('===================');

    this.productService.updateProduct(this.editedProduct.id, updateData).subscribe({
        next: (response) => {
            this.loading = false;
            this.productUpdated.emit();
            

            setTimeout(() => {
                this.closeModal.emit();
                this.resetForm();

            }, 100);
            
        },
        error: (err) => {
            this.loading = false;
            
            if (err.error?.message) {
                this.error = err.error.message;
            } else if (err.error?.errors) {
                this.error = `Error de validación: ${JSON.stringify(err.error.errors)}`;
            } else {
                this.error = 'Error actualizando producto. Intente nuevamente.';
            }
        }
    });
}

    onCancel(): void {
        this.closeModal.emit();
    }

    private resetForm(): void {
    this.selectedProductId = '';
    this.editedProduct = null;
    this.error = null;
}
}