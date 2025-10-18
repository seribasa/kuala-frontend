import {Component} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // Example bindings (could later be fetched from API)
  appointment = "10:00 AM with Emily Carter";
  revenue = 2500;
  satisfactionRate = 85;
}
