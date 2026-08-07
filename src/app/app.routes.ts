import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public/public-layout.component';
import { PrivateLayoutComponent } from './layouts/private/private-layout.component';
import { LoginComponent } from './features/public/login/login.component';
import { LandingComponent } from './features/public/landing/landing.component';
import { DashboardComponent } from './features/private/dashboard/dashboard.component';
import { ProfileComponent } from './features/private/profile/profile.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: LandingComponent
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [publicGuard]
      }
    ]
  },
  {
    path: 'app',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
