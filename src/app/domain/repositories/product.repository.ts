import { Observable } from "rxjs";
import { CreateProductRequest, Product, ProductListResponse } from "../../core/models/product.model";

export abstract class ProductRepository {

    // Get all products
    abstract getAll(): Observable<ProductListResponse>;

    // Create a product
    abstract create(product: CreateProductRequest): Observable<Product>

}