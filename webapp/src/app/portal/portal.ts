import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-portal',
  imports: [
    RouterLinkActive,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class Portal {

  constructor(private router: Router, private authService: AuthService) {
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.router.navigate(['/']);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

}
