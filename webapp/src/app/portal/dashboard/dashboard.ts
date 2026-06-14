import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  constructor(private route: ActivatedRoute,
              private dashboardService: DashboardService) {
  }

  public async ngOnInit() {
    let subscriptionId: string = this.route.snapshot.queryParams['subscriptionId'];

    if (subscriptionId) {
      await this.dashboardService.createSubscription(subscriptionId);
    }

    this.dashboardService.getSubscription().then(subscription => {
      console.log(subscription);
    });
  }

}
