import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";

// Home page 

@Component( {

    selector: 'home-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css'

})

export default class HomePageComponent {


    // Show actual date

    actualDate: Date = new Date();


    


}