import { Injectable } from "@angular/core";
import { ExportRepository } from "./export.repository";
import { DateRange } from "../../core/models/date-range.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { firstValueFrom } from "rxjs";

@Injectable({

    providedIn: 'root'
    
})


export class ExportRepositoryImpl extends ExportRepository {
    

    private apiUrl = `${environment.apiUrl}/api/Export/export`;

    constructor(private http: HttpClient) {

        super();

    }

    async exportMetrics(dateRange: DateRange): Promise<Blob> {
        
        const params = {

            startDate: dateRange.startDate.toISOString().split('T')[0],
            endDate: dateRange.endDate.toISOString().split('T')[0]

        };


        return await firstValueFrom(

            this.http.get(this.apiUrl, {

                params,
                responseType: 'blob'

            })

        )

    }

}