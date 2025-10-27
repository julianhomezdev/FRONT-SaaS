import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Product } from "../../../core/models/product.model";
import { ProductApiService } from "../../../core/services/product-api.service";


@Component({


    selector: 'products-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    styleUrl: './products-page.component.css',
    templateUrl: './products-page.component.html'


})



export default class ProductsPageComponent implements OnInit {

    products: Product[] = []
    loading: boolean = false;
    error: string | null = null;

    pageSize: number = 10;
    pageNumber: number = 1;

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

    


}

