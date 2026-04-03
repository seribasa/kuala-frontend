import {Injectable} from '@angular/core';
import {ApiService} from '../../api/ApiService';

@Injectable({providedIn: 'root'})
export class SubscriptionsService {

  constructor(private readonly apiService: ApiService) {
  }

  getSubscription(): any {
    return this.apiService.get('/subscription');
  }

  listPlans(interval?: string): any {
    return this.apiService.get('/plans', {params: {interval}});
  }
}
