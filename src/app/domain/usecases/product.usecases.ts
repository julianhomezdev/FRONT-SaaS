import { Injectable } from "@angular/core";
import { ProductRepository } from "../repositories/product.repository";
import { CreateProductRequest, Product } from "../../core/models/product.model";
import { Observable } from "rxjs";

@Injectable({

    providedIn: 'root'

})

export class ProductUseCases {

    constructor(private productRepository: ProductRepository) {}


    createProduct(product: CreateProductRequest): Observable<Product> {

        return this.productRepository.create(product);

    }

}