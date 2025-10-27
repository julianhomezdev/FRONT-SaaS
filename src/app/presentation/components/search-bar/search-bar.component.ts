import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";


@Component({

    selector: 'search-bar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    styleUrl: './search-bar.component.css',
    templateUrl: './search-bar.component.html'



})



export default class SearchBarComponent {

    @Output() searchChange = new EventEmitter<string>();

    searchTerm: string = '';

    onInputChange(): void {

        this.searchChange.emit(this.searchTerm);

    }

    onClear(): void {

        this.searchTerm = '';
        this.searchChange.emit(this.searchTerm);

    }



}