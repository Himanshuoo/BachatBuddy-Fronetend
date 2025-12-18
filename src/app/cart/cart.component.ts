import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../services/cart.service';
import { AddressService } from '../services/address.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalItems = 0;
  totalPrice = 0;
  defaultAddress: any = null;

  constructor(
    private router: Router,
    private cartService: CartService,
    private addressService: AddressService
  ) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items: CartItem[]) => {
      this.cartItems = items.map(item => ({
        name: item.pname,
        price: item.price,
        quantity: item.qty,
        pid: item.pid,
        image: item.image
      }));
      this.updateTotals();
    });

    const items = this.cartService.getCartItems();
    this.cartItems = items.map(item => ({
      name: item.pname,
      price: item.price,
      quantity: item.qty,
      pid: item.pid,
      image: item.image
    }));
    this.updateTotals();

    const uid = sessionStorage.getItem('uid');
    if (uid) {
      this.addressService.getAddresses(uid).subscribe({
        next: (addresses) => {
          if (addresses && addresses.length > 0) {
            this.defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
          }
        },
        error: (err) => console.error('Error fetching addresses in cart:', err)
      });
    }
  }

  updateTotals() {
    this.totalItems = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
    this.totalPrice = this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
  increaseQuantity(item: any) {
    item.quantity++;
    this.cartService.updateQuantity(item.pid, item.quantity);
    this.updateTotals();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateQuantity(item.pid, item.quantity);
      this.updateTotals();
    }
  }


  removeItem(item: any) {
    this.cartService.removeItem(item.pid);
    this.cartItems = this.cartItems.filter(i => i.pid !== item.pid);
    this.updateTotals();
  }

  buyNow(item: any) {
    this.router.navigate(['/buy', item.pid], { queryParams: { id: item.pid } });
  }

  proceedToCheckout() {
    this.router.navigate(['/buy'], { queryParams: { type: 'cart' } });
  }

  changeAddress() {
    this.router.navigate(['/address'], { queryParams: { returnUrl: '/cart' } });
  }
}
