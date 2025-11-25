import { Routes } from '@angular/router';
import BasicLayoutComponent from './presentation/components/layouts/basic-layout/basic-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '', 
        component: BasicLayoutComponent,
        canActivate: [AuthGuard], 
        children: [
            {
                path: '',
                redirectTo: 'products',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadComponent: () => import('./presentation/pages/home/home-page.component')
            },
            {
                path: 'products',
                loadComponent: () => import('./presentation/pages/products/products-page.component')
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./presentation/pages/auth/login-page/login-page.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./presentation/pages/auth/register-page/register-page.component')
    },
    { 
        path: '**', 
        redirectTo: 'products' 
    }
];