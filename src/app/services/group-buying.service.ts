import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupBuyingProduct, JoinGroupRequest, JoinGroupResponse } from '../models/group-buying.model';

@Injectable({
  providedIn: 'root'
})
export class GroupBuyingService {

  private baseUrl = 'http://localhost:8080/api/group-buying';

  constructor(private http: HttpClient) {}

  /** Get all active group buying products */
  getAllActiveGroupBuys(): Observable<GroupBuyingProduct[]> {
    return this.http.get<GroupBuyingProduct[]>(`${this.baseUrl}`);
  }

  /** Get all active group buying products for a specific user */
  getAllActiveGroupBuysForUser(userId: number): Observable<GroupBuyingProduct[]> {
    return this.http.get<GroupBuyingProduct[]>(`${this.baseUrl}/user/${userId}/products`);
  }

  /** Get a specific group buying product by ID */
  getGroupBuyById(id: number): Observable<GroupBuyingProduct> {
    return this.http.get<GroupBuyingProduct>(`${this.baseUrl}/${id}`);
  }

  /** Get a specific group buying product by ID with user context */
  getGroupBuyByIdForUser(id: number, userId: number): Observable<GroupBuyingProduct> {
    return this.http.get<GroupBuyingProduct>(`${this.baseUrl}/${id}/user/${userId}`);
  }

  /** Join a group buying product */
  joinGroup(request: JoinGroupRequest): Observable<JoinGroupResponse> {
    return this.http.post<JoinGroupResponse>(`${this.baseUrl}/join`, request);
  }

  /** Convenience method to join a group */
  joinGroupByIds(userId: number, productId: number, quantity: number = 1): Observable<JoinGroupResponse> {
    const request: JoinGroupRequest = {
      userId,
      groupBuyingProductId: productId,
      quantity
    };
    return this.joinGroup(request);
  }

  /** Get all group participations for a user */
  getUserParticipations(userId: number): Observable<GroupBuyingProduct[]> {
    return this.http.get<GroupBuyingProduct[]>(`${this.baseUrl}/user/${userId}/participations`);
  }

  /** Get products by category */
  getProductsByCategory(category: string): Observable<GroupBuyingProduct[]> {
    return this.http.get<GroupBuyingProduct[]>(`${this.baseUrl}/category/${category}`);
  }

  /** Create a new group buying product (Admin) */
  createGroupBuyingProduct(product: Partial<GroupBuyingProduct>): Observable<GroupBuyingProduct> {
    return this.http.post<GroupBuyingProduct>(`${this.baseUrl}`, product);
  }
}