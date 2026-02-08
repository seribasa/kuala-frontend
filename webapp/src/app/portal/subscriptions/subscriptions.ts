import {Component} from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  imports: [],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css'
})
export class Subscriptions {

  subscription = {
    planName: 'Premium',
    price: 99.99,
    billingCycle: 'month',
    startDate: '2025-02-01',
    nextBillingDate: '2025-03-01',
    features: [
      'Business Process',
      'Clinic Virtual Assistant',
      'Event Management',
      'Landing Page',
      'Published Apps'
    ]
  };


}
