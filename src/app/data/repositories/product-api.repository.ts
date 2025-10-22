import { Injectable } from "@angular/core";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { HttpClient } from "@angular/common/http";
import { CreateProductRequest, Product, ProductListResponse } from "../../core/models/product.model";
import { Observable } from "rxjs";

@Injectable({

    providedIn: 'root'

})



export class ProductApiRepository extends ProductRepository {
    

    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) {

        super();

    }

    // Method to create product
    create(product: CreateProductRequest): Observable<Product> {

        return this.http.post<Product>(this.apiUrl, product);

    }

    override getAll(): Observable<ProductListResponse> {
        throw new Error("Method not implemented.");
    }

}