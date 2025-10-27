import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Product } from "../../../core/models/product.model";
import { ProductApiService } from "../../../core/services/product-api.service";
import FilterManagerComponent, { FilterCriteria } from "../../components/filter-manager/filter-manager.component";


@Component({


    selector: 'products-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FilterManagerComponent],
    styleUrl: './products-page.component.css',
    templateUrl: './products-page.component.html'


})



export default class ProductsPageComponent implements OnInit {

    products: Product[] = [];
    filteredProducts: Product[] = [];
    loading: boolean = false;
    error: string | null = null;

    pageSize: number = 10;
    pageNumber: number = 1;

    isDropdownOpen: boolean = false;
    selectedOption: string = 'Selecciona una opción'
    searchTerm: string = '';

    constructor(private productService: ProductApiService) { }

    ngOnInit(): void {
        

        this.loadProducts();
    }

   

    loadProducts(): void  {


        this.loading = true;
        this.error = null;

        this.productService.getAllProducts(this.pageSize, this.pageNumber)
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

    onFilterChange(filters: FilterCriteria): void {

        console.log(filters);
        console.log(this.products.length);
        console.log(this.products);

        const term = filters.searchTerm.toLowerCase().trim();

        if (term) {

            this.filteredProducts = this.products.filter(product =>

                product.productName.toLowerCase().includes(term) ||
                product.productReference.toLowerCase().includes(term)

            );

        } else {

            this.filteredProducts= [...this.products];

        }

    }



    onPageChange(page: number): void {

        this.pageNumber = page;
        this.loadProducts();

    }

    toggleDropdown(): void {

        this.isDropdownOpen = !this.isDropdownOpen;

    }

    selectOption(option: string): void{

        this.selectedOption = option;
        this.isDropdownOpen = false;



        switch(option) {




        }

    }

    


}

