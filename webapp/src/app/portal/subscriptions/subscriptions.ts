import {Component, OnInit} from '@angular/core';
import {SubscriptionsService} from './subscriptions.service';
import {mapPlans} from '../../shared/plan-utils';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {PageHeader} from '../../shared/page-header';

@Component({
  selector: 'app-subscriptions',
  imports: [MatButtonToggleGroup, MatButtonToggle, MatButton, MatIcon, PageHeader],
  templateUrl: './subscriptions.html',
})
export class Subscriptions implements OnInit {

  subscription: any;

  billingCycle: string = 'monthly';
  monthlyPlans: any[] = [];
  annualPlans: any[] = [];
  allFeatures: string[] = [];
  errorMessage = '';

  private readonly planLevels = ['Free', 'Basic', 'Premium', 'Enterprise'];

  constructor(private subscriptionsService: SubscriptionsService) {
  }

  async ngOnInit(): Promise<void> {
    try {
      [this.monthlyPlans, this.annualPlans, this.subscription] = await Promise.all([this.loadPlans('month'), this.loadPlans('year'), this.getSubscription()]);
      this.allFeatures = this.extractAllFeatures();
    } catch {
      this.errorMessage = 'We could not load subscription details. Please try again.';
    }
  }

  async loadPlans(interval: string) {
    try {
      const response = await this.subscriptionsService.listPlans(interval);
      return mapPlans(response);
    } catch (err) {
      console.error(`Failed to load ${interval} plans`, err);
      return [];
    }
  }

  async getSubscription() {
    try {
      const results = await this.subscriptionsService.getSubscription();
      if ((results?.subscriptions?.length ?? 0) > 0) {
        return results?.subscriptions?.[0] ?? null;
      }
    } catch (err) {
      console.error('Failed to fetch subscription', err);
    }
    return null;
  }

  displayedPlans() {
    const plans = this.billingCycle === 'monthly' ? this.monthlyPlans : this.annualPlans;
    const currentLevel = this.getPlanLevel(this.subscription?.name);

    return plans.filter((plan) => {
      const planLevel = this.getPlanLevel(plan.name);
      return plan.name !== this.subscription?.name && planLevel >= currentLevel;
    });
  }

  private getPlanLevel(name?: string): number {
    const level = this.planLevels.indexOf(name ?? '');
    return level === -1 ? Number.MAX_SAFE_INTEGER : level;
  }

  setBillingCycle(cycle: string) {
    this.billingCycle = cycle;
  }

  private extractAllFeatures(): string[] {
    const allFeatures = this.monthlyPlans.flatMap((plan) => plan.features ?? []);
    return [...new Set(allFeatures)];
  }

  planHasFeature(plan: any, feature: string): boolean {
    return plan.features.includes(feature);
  }
}
