import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component( {

    selector: 'main-nav-bar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './main-nav-bar.component.html',
    styleUrl: './main-nav-bar.component.css'

})

export default class MainNavBarComponent {}