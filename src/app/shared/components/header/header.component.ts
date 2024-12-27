import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/authentication/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, RouterLink, RouterLinkActive, NgIf, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isLoggedIn!: Observable<boolean>;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    console.log(this.isLoggedIn);
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout();
  }
}
