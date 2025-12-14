import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  status: string = '';

  constructor(private router: Router, private userService: UserService) { }

  login(): void {
    const username = this.credentials.username.trim();
    const password = this.credentials.password.trim();

    if (!username || !password) {
      this.status = 'Please enter both username and password.';
      return;
    }

    this.userService.loginUser(username, password).subscribe({
      next: (user: any) => {
        sessionStorage.clear();

        // ✅ Store numeric userId for backend calls
        sessionStorage.setItem('uid', user.id.toString());

        // ✅ Store username for UI display
        sessionStorage.setItem('username', user.username);

        this.userService.setLoginStatus(true);

        const redirectUrl = sessionStorage.getItem('redirectUrl');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectUrl');
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.status = 'User not found. Please register.';
        } else if (err.status === 401) {
          this.status = 'Invalid credentials. Try again.';
        } else {
          this.status = 'Login failed due to server error.';
        }
      }
    });
  }
}