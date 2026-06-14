import {Component, OnInit} from '@angular/core';
import {SubscriptionsService} from './subscriptions.service';
import {mapPlans} from '../../shared/plan-utils';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-subscriptions',
  imports: [MatButtonToggleGroup, MatButtonToggle, MatButton, MatIcon],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css'
})
export class Subscriptions implements OnInit {

  subscription: any;

  billingCycle: string = 'monthly';
  monthlyPlans: any[] = [];
  annualPlans: any[] = [];
  allFeatures: string[] = [];

  private readonly planLevels = ['Free', 'Basic', 'Premium', 'Enterprise'];

  constructor(private subscriptionsService: SubscriptionsService) {
  }

  async ngOnInit() {
    this.monthlyPlans = await this.loadPlans('month');
    this.annualPlans = await this.loadPlans('year');
    this.subscription = await this.getSubscription();
    this.allFeatures = this.extractAllFeatures();
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
      const subscriptions = await this.subscriptionsService.getSubscription();
      console.log(subscriptions);
      if (subscriptions.length > 0) {
        console.log(subscriptions[0]);
        return subscriptions[0];
      }
    } catch (err) {
      console.error('Failed to fetch subscription', err);
    }
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
    return (plan.features ?? []).includes(feature);
  }
}
