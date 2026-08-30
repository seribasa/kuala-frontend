import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-portal',
  imports: [RouterLinkActive, RouterOutlet, RouterLink, MatButton, MatIcon],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class Portal implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      await this.router.navigate(['/']);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

}
