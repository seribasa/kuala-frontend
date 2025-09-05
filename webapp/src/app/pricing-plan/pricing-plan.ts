import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PricingPlanService} from './pricing-plan.service';

@Component({
  selector: 'app-pricing-plan',
  imports: [],
  templateUrl: './pricing-plan.html',
  styleUrl: './pricing-plan.css'
})
export class PricingPlan implements OnInit {

  constructor(private router: Router,
              private pricingPlanService: PricingPlanService) {
  }

  ngOnInit(): void {
    this.loadSubscriptionPlans();
  }

  goToLogin(): void {
  }

  loadSubscriptionPlans(interval: string = 'month') {
    this.pricingPlanService.listSubscriptionPlans(interval)
      .subscribe(response => {
        console.log(response);
      });
  }

}
