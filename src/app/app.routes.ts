import { Routes } from '@angular/router';
import { ProductFormComponent } from './presentation/products/products-form/product-form.component';

export const routes: Routes = [

    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'products/create', component: ProductFormComponent},
    { path: '**', redirectTo: '/products/create' }


];
