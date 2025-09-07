import {Routes} from '@angular/router';
import {PricingPlan} from './pricing-plan/pricing-plan';
import {authGuard} from './auth/auth.guard';
import {Home} from './home/home';
import {Dashboard} from './dashboard/dashboard';

export const routes: Routes = [
  {path: '', component: PricingPlan},
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: Dashboard},
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'}
    ]
  },
  {path: '**', redirectTo: ''}
];
