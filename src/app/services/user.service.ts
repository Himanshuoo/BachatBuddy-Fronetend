import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';
  private loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();

  constructor(private http: HttpClient) {
    const uid = sessionStorage.getItem('uid');
    this.loginStatus.next(!!uid);
  }

  registerUser(user: any): Observable<any> {
    // Backend returns plain text "User registered successfully", not JSON
    return this.http.post(`${this.baseUrl}/register`, user, {
      responseType: 'text'
    }).pipe(
      tap(response => {
        console.log('Registration successful:', response);
        // User will be redirected to login page to log in with new credentials
      })
    );
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  loginUser(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`${this.baseUrl}/login`, body).pipe(
      tap(user => {
        if (user && user.id) {
          sessionStorage.setItem('uid', user.id.toString());
          this.setLoginStatus(true);
        }
      })
    );
  }

  setLoginStatus(status: boolean): void {
    this.loginStatus.next(status);
  }

  getLoginStatus(): boolean {
    return this.loginStatus.value;
  }

  logout(): void {
    sessionStorage.clear();
    this.setLoginStatus(false);
  }
}
