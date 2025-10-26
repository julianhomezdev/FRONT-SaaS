import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component } from "@angular/core";


@Component({


    selector: 'products-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    styleUrl: './products-page.component.css',
    templateUrl: './products-page.component.html'


})



export default class ProductsPageComponent  {}