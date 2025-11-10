import { DateRange } from "../../core/models/date-range.model";

export abstract class ExportRepository {

    abstract exportMetrics(dateRange: DateRange): Promise<Blob>;

}