import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/order.service';
import { GroupdealsService, GroupDeal } from '../services/groupdeals.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchTerm: string = '';
  loading = true;
  error: string | null = null;
  userName: string = '';
  userPhone: string = '';
  groupDeals: GroupDeal[] = [];

  constructor(
    private ordersService: OrdersService,
    private groupDealsService: GroupdealsService,
    private router: Router
  ) { }
  viewDetails(order: any): void {
    console.log('Viewing details for order:', order);
    // You can navigate to a detailed order page here
    // this.router.navigate(['/order-details', order.id]);
  }

  cancelOrder(order: any): void {
    console.log('Cancelling order:', order);
    // You can call a cancel API here
    // this.ordersService.cancelOrder(order.id).subscribe(...)
  }
  ngOnInit(): void {
    const uid = sessionStorage.getItem('uid');
    const name = sessionStorage.getItem('username'); // Matched with login
    const phone = sessionStorage.getItem('userPhone');

    if (!uid) {
      this.error = 'You must be logged in to view orders.';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.userName = name || 'User';
    this.userPhone = phone || '';

    this.ordersService.getOrders(uid).subscribe({
      next: (data) => {
        // Ensure total and savings are numeric and reconstruct if zero
        this.orders = (data || []).map(o => {
          let total = Number(o.total || 0);
          let savings = Number(o.savings || 0);
          const items = o.items || [];

          // Self-healing: If total is zero but items exist, calculate it
          if (total === 0 && items.length > 0) {
            total = items.reduce((sum: number, item: any) => sum + (Number(item.price || 0) * Number(item.qty || 1)), 0);
          }

          return {
            ...o,
            total: total,
            savings: savings,
            items: items,
            originalPrice: Number(o.originalPrice || total + savings)
          };
        });
        this.filteredOrders = [...this.orders];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error('Order fetch error:', err);
      }
    });
  }

  filterOrders(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredOrders = this.orders.filter(order =>
        order.productName?.toLowerCase().includes(term) ||
        order.status?.toLowerCase().includes(term) ||
        order.shippingAddress?.city?.toLowerCase().includes(term)
      );
    }
  }

  joinDeal(dealId: number): void {
    const uid = Number(sessionStorage.getItem('uid'));
    this.groupDealsService.joinDeal(dealId, uid).subscribe({
      next: () => alert('🎉 You joined the group deal!'),
      error: (err) => console.error('Error joining deal', err)
    });
  }

  reviewOrder(order: any): void {
    const rating = prompt(`How would you rate: ${order.productName}? (1-5 stars)`);
    if (rating) {
      const review = prompt('Any comments? (Optional)');
      // In a real app, call a service here
      alert(`Thanks! You rated it ${rating} stars. Review submitted.`);
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}