import { Routes } from '@angular/router';
import { ProductFormComponent } from './presentation/products/products-form/product-form.component';
import BasicLayoutComponent from './presentation/components/layouts/basic-layout/basic-layout.component';

export const routes: Routes = [

    // Layouts has childrens
    {path: '', component: BasicLayoutComponent, children: [

        {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'

        },
        {
            path: 'home',
            loadComponent: () =>
                import('./presentation/pages/home/home-page.component')
                    .then(m => m.default)

        }, {

            path: 'products',
            loadComponent: () =>
                import('./presentation/pages/products/products-page.component')
                    


        }

    ]}

];
