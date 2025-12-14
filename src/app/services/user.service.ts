import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  loginUser(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(`${this.baseUrl}/login`, body).pipe(
      tap(user => {
        if (user && user.id) {
          sessionStorage.setItem('uid', user.id);
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
