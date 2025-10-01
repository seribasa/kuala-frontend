import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PricingPlanService} from './pricing-plan.service';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {NgOptimizedImage} from '@angular/common';

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

  constructor(private router: Router,
              private pricingPlanService: PricingPlanService) {
  }

  ngOnInit(): void {
    this.loadSubscriptionPlans();
  }

  goToLogin(): void {
  }

  async loadSubscriptionPlans() {
    try {
      const response = await this.pricingPlanService.listSubscriptionPlans();
      this.mapPlans(response);
    } catch (err) {
      console.error('Failed to load subscription plans', err);
    }
  }

  private mapPlans(response: any): void {
    if (!response) {
      return;
    }

    this.monthlyPlans = response.monthly?.plans ?? [];
    this.monthlyPlans = this.monthlyPlans.map((plan: any) => {
      const amount = this.getUsdPrice(plan.prices);
      return {
        ...plan,
        price: this.formatCurrency(amount)
      };
    });

    this.annualPlans = response.annually?.plans ?? [];
    this.annualPlans = this.annualPlans.map((plan: any) => {
      const amount = this.getUsdPrice(plan.prices);
      return {
        ...plan,
        price: this.formatCurrency(amount)
      };
    });
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
