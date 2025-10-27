import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Size } from "../../../core/models/size.model";

@Component({


    selector: 'size-filter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    styleUrl: './size-filter.component.css',
    templateUrl: './size-filter.component.html'

})


export default class SizeFilterComponent implements OnInit {

    @Input() availableSizes: Size[] = [];
    @Output() sizeChange = new EventEmitter<number | null>();

    selectedSizeId: number | null = null;

    ngOnInit() {
        this.onSizeChange();
    }

    onSizeChange(): void {
        console.log('Talla seleccionada:', this.selectedSizeId);
        this.sizeChange.emit(this.selectedSizeId || null);
    }

}