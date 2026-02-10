import {Routes} from '@angular/router';
import {authGuard} from './auth/auth.guard';
import {Public} from './public/public';
import {PricingPlan} from './public/pricing-plan/pricing-plan';
import {About} from './public/about/about';
import {Portal} from './portal/portal';
import {Dashboard} from './portal/dashboard/dashboard';
import {Contact} from './public/contact/contact';
import {Help} from './public/help/help';
import {Profile} from './portal/profile/profile';
import {Subscriptions} from './portal/subscriptions/subscriptions';
import {Invoice} from './portal/invoice/invoice';

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
      {path: 'subscriptions', component: Subscriptions},
      {path: 'invoice', component: Invoice},
      {path: 'profile', component: Profile},
      {path: 'about', component: About},
      {path: 'contact', component: Contact},
      {path: 'help', component: Help},
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'}
    ]
  },
  {path: '**', redirectTo: ''}
];
