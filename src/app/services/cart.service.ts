import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  pid: number;
  pname: string;
  price: number;
  qty: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  addToCart(item: CartItem) {
    const existing = this.cartItems.find(i => i.pid === item.pid);
    if (existing) {
      existing.qty += item.qty;
    } else {
      this.cartItems.push({ ...item });
    }
    this.cartSubject.next(this.cartItems);
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  removeItem(pid: number) {
    this.cartItems = this.cartItems.filter(i => i.pid !== pid);
    this.cartSubject.next(this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
  }

  updateQuantity(pid: number, qty: number) {
    const item = this.cartItems.find(i => i.pid === pid);
    if (item) {
      item.qty = qty;
      this.cartSubject.next([...this.cartItems]);
    }
  }
}
