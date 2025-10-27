import { CommonModule } from "@angular/common";
import { Component, Input, Output } from "@angular/core";
import SearchBarComponent from "../search-bar/search-bar.component";
import { EventEmitter } from "@angular/core";
import { Product } from "../../../core/models/product.model";
import SizeFilterComponent from "../size-filter/size-filter.component";
import { Size } from "../../../core/models/size.model";

export interface FilterCriteria {

    searchTerm: string;
    selectedSizeId: number | null;

}

@Component({


    selector: 'filter-manager',
    standalone: true,
    imports: [CommonModule, SearchBarComponent, SizeFilterComponent],
    styleUrl: './filter-manager.component.css',
    templateUrl: './filter-manager.component.html'


})


export default class FilterManagerComponent {


    @Input() products: Product[]  = [];  
    @Input() availableSizes: Size[] = []; 
    @Output() filterChange = new EventEmitter<FilterCriteria>();

    currentFilters: FilterCriteria = {


        searchTerm: '',
        selectedSizeId: null

    };

    onSearchChange(searchTerm: string): void {

        this.currentFilters.searchTerm = searchTerm;
        this.filterChange.emit(this.currentFilters);

    }

    onSizeChange(selectedSizeId: number | null): void {

        console.log(selectedSizeId);
        this.currentFilters.selectedSizeId = selectedSizeId;
        this.filterChange.emit(this.currentFilters);

    }

}