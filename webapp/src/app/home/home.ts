import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private router: Router) {
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  logout(): void {
  }
}
