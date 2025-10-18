import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatIcon, MatButton, MatIconButton],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnInit {

  isAuthenticated = false;

  constructor(private router: Router,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  goToLanding() {
    this.router.navigate(['/']);
  }

  async login() {
    const redirectTo = window.location.origin + '/home';
    await this.authService.initiateLogin(redirectTo);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }
}
