import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent {
  user = {
    name: '',
    username: '',
    password: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    nationality: ''
  };

  constructor(private userService: UserService, private router: Router) { }

  onRegister(form: NgForm): void {
    if (form.valid) {
      this.user.username = this.user.name; // optional logic
      this.userService.registerUser(this.user).subscribe({
        next: (response) => {
          console.log('✅ Registration response:', response);
          form.resetForm();
          // Show success alert
          alert('✅ Registration successful!');
          // Redirect to home page after user clicks OK on alert
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 100);
        },
        error: (error) => {
          console.error('❌ Registration failed:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error response:', error.error);

          let errorMsg = 'Registration failed. ';
          if (error.status === 0) {
            errorMsg += 'Cannot connect to server. Please check if backend is running.';
          } else if (error.status === 400) {
            errorMsg += 'Invalid data provided.';
          } else if (error.status === 500) {
            errorMsg += 'Server error occurred.';
          } else {
            errorMsg += `Status: ${error.status}. ${error.error?.message || error.message}`;
          }

          alert(errorMsg);
        }
      });
    } else {
      alert('⚠️ Please fill all required fields correctly.');
    }
  }
}