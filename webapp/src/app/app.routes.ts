import {Routes} from '@angular/router';
import {authGuard} from './auth/auth.guard';
import {Patient} from './portal/patient/patient';
import {Public} from './public/public';
import {PricingPlan} from './public/pricing-plan/pricing-plan';
import {About} from './public/about/about';
import {Portal} from './portal/portal';
import {Dashboard} from './portal/dashboard/dashboard';
import {Contact} from './public/contact/contact';
import {Help} from './public/help/help';
import {Appointment} from './portal/appointment/appointment';
import {Profile} from './portal/profile/profile';
import {Billing} from './portal/billing/billing';

export const routes: Routes = [
  {
    path: '',
    component: Public,
    children: [
      {path: 'pricing-plan', component: PricingPlan},
      {path: 'about', component: About},
      {path: 'contact', component: Contact},
      {path: 'help', component: Help},
      {path: '', pathMatch: 'full', redirectTo: 'pricing-plan'},
    ]
  },
  {
    path: 'portal',
    component: Portal,
    canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: Dashboard},
      {path: 'patient', component: Patient},
      {path: 'appointment', component: Appointment},
      {path: 'profile', component: Profile},
      {path: 'billing', component: Billing},
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'}
    ]
  },
  {path: '**', redirectTo: ''}
];
