import {ApiService} from '../../api/ApiService';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PricingPlanService {

  constructor(private readonly apiService: ApiService) {
  }

  listSubscriptionPlans(interval?: string) {
    return this.apiService.get(`/plans`, {params: {interval: interval}});
  }
}
