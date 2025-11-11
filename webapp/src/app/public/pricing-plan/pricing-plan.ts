import {Component, OnInit} from '@angular/core';
import {PricingPlanService} from './pricing-plan.service';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-pricing-plan',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatButton,
    MatCard,
    MatCardImage,
    MatCardContent,
    NgOptimizedImage
  ],
  templateUrl: './pricing-plan.html',
  styleUrl: './pricing-plan.css'
})
export class PricingPlan implements OnInit {

  monthlyPlans: any[] = [];
  annualPlans: any[] = [];

  billingCycle: string = 'monthly';

  constructor(private pricingPlanService: PricingPlanService,
              public authService: AuthService) {
  }

  async ngOnInit() {
    this.monthlyPlans = await this.loadSubscriptionPlans('month');
    this.annualPlans = await this.loadSubscriptionPlans('year');
  }

  async login() {
    const redirectTo = window.location.origin + '/portal';
    await this.authService.initiateLogin(redirectTo);
  }

  async loadSubscriptionPlans(interval: string) {
    try {
      const response = await this.pricingPlanService.listSubscriptionPlans(interval);
      return this.mapPlans(response);
    } catch (err) {
      console.error(`Failed to load ${interval} subscription plans`, err);
      return [];
    }
  }

  private mapPlans(response: any) {
    if (!response) {
      return [];
    }

    let plans = response ?? [];
    plans = plans.map((plan: any) => {
      const amount = this.getUsdPrice(plan.prices);
      return {
        ...plan,
        price: this.formatCurrency(amount),
        usdAmount: amount
      };
    });

    return plans.sort((a: any, b: any) => a.usdAmount - b.usdAmount);
  }

  private getUsdPrice(prices?: any[]): number {
    return prices?.find((p) => p.currency === 'USD')?.amount ?? 0;
  }

  private formatCurrency(amount: number): string {
    return `$${amount}`;
  }

  displayedPlans() {
    return this.billingCycle === 'monthly' ? this.monthlyPlans : this.annualPlans;
  }

  setBillingCycle(cycle: 'monthly' | 'yearly') {
    this.billingCycle = cycle;
  }

}
