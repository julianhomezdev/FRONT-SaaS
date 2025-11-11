import { Routes } from '@angular/router';
import BasicLayoutComponent from './presentation/components/layouts/basic-layout/basic-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

    // Layouts has childrens
    {
        path: '', component: BasicLayoutComponent, children: [

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
                canActivate: [AuthGuard],
                loadComponent: () =>
                    import('./presentation/pages/products/products-page.component')



            }

        ]
    },


    {
        path: 'login',
        loadComponent: () =>
            import('./presentation/pages/auth/login-page/login-page.component')
                .then(m => m.default)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./presentation/pages/auth/register-page/register-page.component')
                .then(m => m.default)
    },

    { path: '**', redirectTo: 'home' }

];
