import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Product } from "../../../core/models/product.model";
import { ProductApiService } from "../../../core/services/product-api.service";
import FilterManagerComponent, { FilterCriteria } from "../../components/filter-manager/filter-manager.component";
import CreateProductComponent from "../../components/create-product/create-product.component";
import { Size } from "../../../core/models/size.model";


@Component({


    selector: 'products-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FilterManagerComponent, CreateProductComponent],
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

    pageSize: number = 10;
    pageNumber: number = 1;

    isDropdownOpen: boolean = false;
    selectedOption: string = 'Selecciona una opción'
    searchTerm: string = '';

    constructor(private productService: ProductApiService) { }

    ngOnInit(): void {
        

        this.loadProducts();
        this.loadSizes();
    }

   

    loadProducts(): void  {


        this.loading = true;
        this.error = null;

        this.productService.getAllProducts(this.pageSize, this.pageNumber, undefined)
            .subscribe({

                next: (products) => {

                    console.log(products);


                    this.products = products;
                    this.loading = false;
                    this.filteredProducts = products;
                    

                },
                
                error: (err) => {

                    this.error = 'Error loading products';
                    this.loading = false;
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
                this.products = products;
                this.loading = false;
                
                if (filters.searchTerm) {
                    const term = filters.searchTerm.toLowerCase().trim();
                    this.filteredProducts = products.filter(product =>
                        product.productName.toLowerCase().includes(term) ||
                        product.productReference.toLowerCase().includes(term)
                    );
                } else {
                    this.filteredProducts = products;
                }
            },
            error: (err) => {
                this.error = 'Error loading products';
                this.loading = false;
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

    selectOption(option: string): void{

        this.selectedOption = option;
        this.isDropdownOpen = false;



        switch(option) {

            case 'Crear producto':

                this.toggleCreateModal();
                break;


        }

    }

    


}

