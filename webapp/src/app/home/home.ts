import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private router: Router, private authService: AuthService) {
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }
}
