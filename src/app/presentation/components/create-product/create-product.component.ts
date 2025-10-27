import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({

    selector: 'create-product',
    standalone: true,
    imports: [CommonModule, RouterModule],
    styleUrl: './create-product.component.css',
    templateUrl: './create-product.component.html'


})


export default class CreateProductComponent {}