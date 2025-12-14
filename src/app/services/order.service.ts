// src/app/orders.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private base = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  getOrders(uid: string) {
    return this.http.get<any[]>(`${this.base}/user/${uid}`);
  }

  createOrder(uid: string, body: any) {
    return this.http.post(`${this.base}/user/${uid}`, body);
  }

}
