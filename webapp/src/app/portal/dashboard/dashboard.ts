import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from './dashboard.service';
import {MatButton} from '@angular/material/button';
import {PageHeader} from '../../shared/page-header';

@Component({
  selector: 'app-dashboard',
  imports: [MatButton, PageHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  constructor(private route: ActivatedRoute,
              private dashboardService: DashboardService) {
  }

  public async ngOnInit(): Promise<void> {
    const subscriptionId = this.route.snapshot.queryParamMap.get('subscriptionId');

    if (subscriptionId) {
      await this.dashboardService.createSubscription(subscriptionId);
    }

    await this.dashboardService.getSubscription();
  }

}
