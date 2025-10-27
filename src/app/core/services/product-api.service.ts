import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
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


        if(pageSize) {
            params = params.set('pageSize', pageSize.toString());
        }

        if(pageNumber) {
            params = params.set('pageNumber', pageNumber.toString());
        }

        if(sizeIds && sizeIds.length > 0) {
        sizeIds.forEach(id => {
            params = params.append('sizeIds', id.toString());
        });
    }

        return this.http.get<Product[]>(this.apiUrl, {params});

    }

    createProduct(productData: any) {


        return this.http.post(this.apiUrl, productData);

    }

    getSizes(): Observable<Size[]> {


        return this.http.get<Size[]>(this.apiSizeUrl);

    }

}