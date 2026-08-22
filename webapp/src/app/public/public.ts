import {Component} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
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
    RouterLink
  ],
  templateUrl: './public.html',
  styleUrl: './public.css'
})
export class Public {
  menuOpen = false;

  constructor(private router: Router,
              public authService: AuthService) {
  }

  async login(): Promise<void> {
    const redirectTo = window.location.origin + '/portal/';
    await this.authService.initiateLogin(redirectTo);
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }

}
