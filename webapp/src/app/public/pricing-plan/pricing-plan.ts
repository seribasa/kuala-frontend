import {Component, OnInit} from '@angular/core';
import {PricingPlanService} from './pricing-plan.service';
import {mapPlans} from '../../shared/plan-utils';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {MatAnchor, MatButton} from '@angular/material/button';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pricing-plan',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatButton,
    MatAnchor,
  ],
  templateUrl: './pricing-plan.html',
  styleUrl: './pricing-plan.css'
})
export class PricingPlan implements OnInit {

  monthlyPlans: any[] = [];
  annualPlans: any[] = [];

  billingCycle: string = 'monthly';
  errorMessage = '';

  constructor(private pricingPlanService: PricingPlanService,
              public authService: AuthService,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    try {
      [this.monthlyPlans, this.annualPlans] = await Promise.all([this.loadSubscriptionPlans('month'), this.loadSubscriptionPlans('year')]);
    } catch {
      this.errorMessage = 'Plans are temporarily unavailable. Please try again later.';
    }
  }

  async login(id: string) {
    const url = new URL('/portal/dashboard', window.location.origin);
    url.searchParams.set('subscriptionId', id);
    await this.authService.initiateLogin(url.toString());
  }

  async loadSubscriptionPlans(interval: string) {
    try {
      const response = await this.pricingPlanService.listSubscriptionPlans(interval);
      return mapPlans(response);
    } catch (err) {
      console.error(`Failed to load ${interval} subscription plans`, err);
      return [];
    }
  }

  displayedPlans() {
    return this.billingCycle === 'monthly' ? this.monthlyPlans : this.annualPlans;
  }

  setBillingCycle(cycle: 'monthly' | 'yearly') {
    this.billingCycle = cycle;
  }

  async contactUs() {
    try {
      await this.router.navigate(['/contact']);
    } catch (err) {
      console.error('Navigation to contact page failed', err);
    }
  }

}
