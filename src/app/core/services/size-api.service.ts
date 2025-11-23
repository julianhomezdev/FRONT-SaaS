import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Size } from "../models/size.model";
import { HttpClient } from "@angular/common/http";

@Injectable({

    providedIn: 'root'
})

export class SizeApiService {
  private apiUrl = `${environment.apiUrl}/api/Size`;

  constructor(private http: HttpClient) { }

  getAllSizes(): Observable<Size[]> {
    return this.http.get<Size[]>(this.apiUrl);
  }

  getSizeById(id: number): Observable<Size> {
    return this.http.get<Size>(`${this.apiUrl}/${id}`);
  }

  createSize(sizeName: string): Observable<any> {
    return this.http.post(this.apiUrl, { sizeName });
  }}