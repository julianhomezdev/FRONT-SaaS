import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";
import { Size } from "../models/size.model";

@Injectable({


    providedIn: 'root'

})


export class ProductApiService {

    private apiUrl = `${environment.apiUrl}/api/Product`;
    private apiSizeUrl = `${environment.apiUrl}/api/Product/sizes`;


    constructor(private http: HttpClient) {}


    getAllProducts(pageSize?: number, pageNumber?: number, sizeIds?: number[]) : Observable<Product[]> {

        let params = new HttpParams();


        /**if(pageSize) {
            params = params.set('pageSize', pageSize.toString());
        }**/

        /**if(pageNumber) {
            params = params.set('pageNumber', pageNumber.toString());
        }**/

        if(sizeIds && sizeIds.length > 0) {
        sizeIds.forEach(id => {
            params = params.append('sizeIds', id.toString());
        });
    }

        return this.http.get<Product[]>(this.apiUrl, {params});

    }

    createProduct(productData: any) {


        return this.http.post(this.apiUrl, productData);
        headers: new HttpHeaders({

            

        })

    }

    deleteProduct(productId: number): Observable<any> {

        return this.http.delete(`${this.apiUrl}/delete/${productId}`);

    }

    getSizes(): Observable<Size[]> {


        return this.http.get<Size[]>(this.apiSizeUrl);

    }

    createInvoice(invoiceData: any): Observable<any> {

        return this.http.post(`${this.apiUrl}/invoices`, invoiceData);

    }

    updateProduct(productId: number, productData: any): Observable<any> {
        const formData = new FormData();
        
        formData.append('ProductName', productData.ProductName);
        formData.append('ProductReference', productData.ProductReference);
        formData.append('ProductPrice', productData.ProductPrice.toString());
        formData.append('ProductTypeId', productData.ProductTypeId.toString());
        formData.append('Sizes', productData.Sizes); // Ya viene como JSON string
        
        // Si en el futuro quieres agregar imagen:
        // if (productData.ImageFile) {
        //     formData.append('ImageFile', productData.ImageFile);
        // }
        
        return this.http.put(`${this.apiUrl}/update/${productId}`, formData);
    }
}

