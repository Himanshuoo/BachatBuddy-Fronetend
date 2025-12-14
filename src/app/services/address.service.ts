import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // GET all addresses for a user
  getAddresses(uid: string) {
    return this.http.get<any[]>(`${this.baseUrl}/users/${uid}/addresses`);
  }

  // ADD address for a user
  addAddress(uid: string, payload: any) {
    return this.http.post(`${this.baseUrl}/users/${uid}/addresses`, payload);
  }

  // UPDATE address by id
  updateAddress(id: string, payload: any) {
    return this.http.put(`${this.baseUrl}/addresses/${id}`, payload);
  }

  // DELETE address by id
  deleteAddress(id: string) {
    return this.http.delete(`${this.baseUrl}/addresses/${id}`);
  }
}