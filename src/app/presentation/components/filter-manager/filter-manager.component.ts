import { CommonModule } from "@angular/common";
import { Component, Input, Output } from "@angular/core";
import SearchBarComponent from "../search-bar/search-bar.component";
import { EventEmitter } from "@angular/core";
import { Product } from "../../../core/models/product.model";

export interface FilterCriteria {

    searchTerm: string;

}

@Component({


    selector: 'filter-manager',
    standalone: true,
    imports: [CommonModule, SearchBarComponent],
    styleUrl: './filter-manager.component.css',
    templateUrl: './filter-manager.component.html'


})


export default class FilterManagerComponent {


    @Input() products: Product[]  = [];   
    @Output() filterChange = new EventEmitter<FilterCriteria>();

    currentFilters: FilterCriteria = {


        searchTerm: ''

    };

    onSearchChange(searchTerm: string): void {

        this.currentFilters.searchTerm = searchTerm;
        this.filterChange.emit(this.currentFilters);

    }

}