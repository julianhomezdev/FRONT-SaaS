import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import MainNavBarComponent from "../../main-nav-bar/main-nav-bar.component";
import HomePageComponent from "../../../pages/home/home-page.component";

@Component({

    selector: 'basic-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, MainNavBarComponent, HomePageComponent],
    styleUrl: './basic-layout.component.css',
    templateUrl: './basic-layout.component.html'

})

export default class BasicLayoutComponent {}