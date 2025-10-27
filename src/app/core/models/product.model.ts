import { Size } from "./size.model";

export interface Product {

    id?: number;
    productName: string;
    productReference: string;
    productPrice: number;
    productTypeId: number;
    productSizes?: ProductsSizes[];

}

export interface ProductsSizes {

    id?: number;
    productId: number;
    sizeId: number;
    sizeStock: number
    size?: Size;

}

export interface ProductTypes {

    id?: number;
    productTypeName: string;
    productTypeDescription: string


}

export interface ProductListResponse {

    products: Product[];
    total: number;

}

export interface CreateProductRequest {

    productName: string;
    productReference: string;
    productPrice: number;
    roductTypeId: number;

}
