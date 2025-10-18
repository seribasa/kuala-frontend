import {Component} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-public',
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatToolbar,
    RouterOutlet,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './public.html',
  styleUrl: './public.css'
})
export class Public {

  constructor(private router: Router,
              public authService: AuthService) {
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  async login() {
    const redirectTo = window.location.origin + '/portal';
    await this.authService.initiateLogin(redirectTo);
  }

}
