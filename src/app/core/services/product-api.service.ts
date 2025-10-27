import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({


    providedIn: 'root'

})


export class ProductApiService {

    private apiUrl = `${environment.apiUrl}/api/Product`;


    constructor(private http: HttpClient) {}


    getAllProducts(pageSize?: number, pageNumber?:  number) : Observable<Product[]> {

        let params = new HttpParams();


        if(pageSize) {
            params = params.set('pageSize', pageSize.toString());
        }

        if(pageNumber) {
            params = params.set('pageNumber', pageNumber.toString());
        }

        return this.http.get<Product[]>(this.apiUrl, {params});

    }

    

}