import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Product } from "../../../core/models/product.model";
import { ProductApiService } from "../../../core/services/product-api.service";
import FilterManagerComponent, { FilterCriteria } from "../../components/filter-manager/filter-manager.component";
import CreateProductComponent from "../../components/create-product/create-product.component";
import { Size } from "../../../core/models/size.model";
import CreateInvoiceComponent from "../../components/create-invoice/create-invoice.component";
import DeleteProductComponent from "../../components/delete-product/delete-product.component";
import EditProductComponent from "../../components/edit-product/edit-product.component";
import ExportMetrics from "../../components/export-metrics/export-metrics.component";


@Component({

    selector: 'products-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FilterManagerComponent, CreateProductComponent, CreateInvoiceComponent, DeleteProductComponent, EditProductComponent, ExportMetrics],
    styleUrl: './products-page.component.css',
    templateUrl: './products-page.component.html'

})



export default class ProductsPageComponent implements OnInit {

        products: Product[] = [];
        filteredProducts: Product[] = [];
        availableSizes: Size[] = [];
        loading: boolean = false;
        error: string | null = null;
        showCreateModal: boolean = false;
        showDeleteModal : boolean = false;
        showEditModal: boolean = false;
        showExportModal: boolean = false;

        pageSize: number = 10;
        pageNumber: number = 1;

        isDropdownOpen: boolean = false;
        selectedOption: string = 'Selecciona una opción'
        searchTerm: string = '';
        showInvoiceModal: boolean = false; 



        constructor(private productService: ProductApiService) { }

        ngOnInit(): void {
            

            this.loadProducts();
            this.loadSizes();
        }

        toggleEditModal(): void {
            this.showEditModal = !this.showEditModal;
        }


        toggleExportModal(): void {

            this.showExportModal = !this.showExportModal;

        }

        onProductUpdated(): void {
            this.loadProducts();  
                this.showEditModal = false;
        }

    
        toggleDeleteModal(): void {

            this.showDeleteModal = !this.showDeleteModal;

        }

        onProductDeleted(): void {

            this.showDeleteModal = false;
            this.loadProducts();


        }

    loadProducts(): void {
        this.loading = true;
        this.error = null;

        this.productService.getAllProducts(this.pageSize, this.pageNumber, undefined)
            .subscribe({
                next: (products) => {
                    console.log(products);
                    this.products = products || []; 
                    this.filteredProducts = products || []; 
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error loading products';
                    this.loading = false;
                    this.filteredProducts = []; 
                    console.error(err);
                }
            });
    }

    loadSizes(): void {

            this.productService.getSizes().subscribe({
                
            next: (sizes) => {

                this.availableSizes = sizes;

            },

            error: (err) => {

                console.error('Error loading sizes:', err);

                
            }
            });
    }

    onFilterChange(filters: FilterCriteria): void {
        this.loading = true;
        const sizeIds = filters.selectedSizeId ? [filters.selectedSizeId] : undefined;
        
        this.productService.getAllProducts(this.pageSize, this.pageNumber, sizeIds)
            .subscribe({
                next: (products) => {
                    this.products = products || [];
                    this.loading = false;
                    
                    if (filters.searchTerm) {
                        const term = filters.searchTerm.toLowerCase().trim();
                        this.filteredProducts = (products || []).filter(product =>
                            product.productName.toLowerCase().includes(term) ||
                            product.productReference.toLowerCase().includes(term)
                        );
                    } else {
                        this.filteredProducts = products || [];
                    }
                },
                error: (err) => {
                    this.error = 'Error loading products';
                    this.loading = false;
                    this.filteredProducts = []; 
                    console.error(err);
                }
            });
        }



        onPageChange(page: number): void {

            this.pageNumber = page;
            this.loadProducts();

        }

        toggleDropdown(): void {

            this.isDropdownOpen = !this.isDropdownOpen;

        }

        toggleCreateModal(): void {

            this.showCreateModal = !this.showCreateModal;

        }

        onProductCreated(): void {

            this.showCreateModal = false;
            this.loadProducts(); // Recharge after creation

        }

        toggleInvoiceModal(): void {
            this.showInvoiceModal = !this.showInvoiceModal;
        }

        selectOption(option: string): void{

            this.selectedOption = option;
            this.isDropdownOpen = false;



            switch(option) {

                case 'Crear producto':

                    this.toggleCreateModal();
                    break;

                case 'Crear factura': 
                    this.toggleInvoiceModal();
                    break;

                case 'Eliminar producto':

                    this.toggleDeleteModal();
                    break;
                case 'Editar producto':
                    this.toggleEditModal();
                    break;
                case 'Exportar metricas': 
                    this.toggleExportModal();
                    break;
            

            }

        }


        getProductImageUrl(product: any): string {
        if (product.imageUrl) {
            return `https://rs28j11l-5174.use2.devtunnels.ms/SaaS/wwwroot/${product.imageUrl}`;
            //https://rs28j11l-5174.use2.devtunnels.ms/SaaS/wwwroot/
            //http://localhost:5174
            //https://rs28j11l-5174.use2.devtunnels.ms/
        }

        return ''
        }

        


    }

