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

  // Example bindings (could later be fetched from API)
  appointment = "10:00 AM with Emily Carter";
  revenue = 2500;
  satisfactionRate = 85;

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
