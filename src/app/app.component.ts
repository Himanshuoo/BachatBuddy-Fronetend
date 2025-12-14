import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BachatBuddy';
  isLoggedIn = false;
  isProfileDropdownOpen = false;
  isMenuOpen = false; // Hamburger menu state
  userName: string | null = null;
  cartCount: any;

  constructor(public r: Router, private userService: UserService) { }

  ngOnInit(): void {
    console.log('AppComponent initialized');

    // Subscribe to login status changes
    this.userService.loginStatus$.subscribe(status => {
      console.log('Login status changed:', status);
      this.isLoggedIn = status;

      if (status) {
        const uid = sessionStorage.getItem('uid');
        if (uid) {
          this.userService.getUserById(uid).subscribe({
            next: (user) => {
              console.log('Fetched user:', user);
              const name = user?.name || user?.username || user?.data?.name || user?.data?.username;
              this.userName = name || 'User';
            },
            error: () => this.userName = 'User'
          });
        }
      } else {
        this.userName = null;
      }
    });

    // Check if session exists on refresh
    const uid = sessionStorage.getItem('uid');
    if (uid) {
      this.userService.setLoginStatus(true);
      // Data fetch handled by subscription above
    }
  }

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      this.isProfileDropdownOpen = false;
    }
    // Close menu when clicking outside hamburger button and nav-links
    if (!target.closest('.hamburger-btn') && !target.closest('.nav-links')) {
      this.isMenuOpen = false;
    }
  }

  logout(): void {
    this.userService.logout();
    this.isLoggedIn = false;
    this.isProfileDropdownOpen = false;
    this.userName = null;
    this.r.navigate(['/home']);
  }

  show(): void {
    const res = (document.getElementById('txtsearch') as HTMLInputElement).value;
    this.r.navigate(['search'], { queryParams: { s: res } });
  }
}
