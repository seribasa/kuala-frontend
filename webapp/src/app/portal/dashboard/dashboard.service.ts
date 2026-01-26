import {Injectable} from '@angular/core';
import {ApiService} from '../../api/ApiService';

@Injectable({providedIn: 'root'})
export class DashboardService {

  constructor(private readonly apiService: ApiService) {
  }

  public async createSubscription(subscriptionId: string) {
    return this.apiService.post('/subscriptions', {
      planId: subscriptionId
    });
  }

  public async getSubscription() {
    return this.apiService.get('/subscriptions');
  }
}
