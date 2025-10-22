export interface Product {

    Id?: number;
    ProductName: string;
    ProductReference: string;
    ProductPrice: number;
    ProductTypeId: number

}

export interface ProductsSizes {

    Id?: number;
    ProductId: number;
    SizeId: number;
    SizeStock: number

}

export interface ProductTypes {

    Id?: number;
    ProductTypeName: string;
    ProductTypeDescription: string


}

export interface ProductListResponse {

    products: Product[];
    total: number;

}

export interface CreateProductRequest {

    ProductName: string;
    ProductReference: string;
    ProductPrice: number;
    ProductTypeId: number;

}
