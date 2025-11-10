import { DateRange } from "../../core/models/date-range.model";
import { ExportRepository } from "../repositories/export.repository";

export class ExportMetricsUseCase {

    constructor(private repository: ExportRepository) {}


    async execute(dateRange: DateRange): Promise<Blob> {

        this.validateDateRange(dateRange);
        return await this.repository.exportMetrics(dateRange);

    }

    private validateDateRange(dateRange: DateRange): void {

        if(dateRange.startDate > dateRange.endDate)  {

            throw new Error('La fecha inicial no puede ser mayor que la fecha inicial');

        }

    }

}