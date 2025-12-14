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
        this.orders = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error('Order fetch error:', err);
      }
    });

    // Dummy group deal for visualization
    const dummyDeals: GroupDeal[] = [
      {
        id: 1,
        productName: 'Wireless Earbuds',
        originalPrice: 2999,
        discountedPrice: 1999,
        maxParticipants: 5,
        currentParticipants: 3,
        status: 'OPEN'
      },
      {
        id: 2,
        pimage: 'assets/earbuds.jpg',
        productName: 'Bluetooth Earbuds',
        originalPrice: 1999,
        discountedPrice: 1599,
        maxParticipants: 5,
        currentParticipants: 3,
        status: 'OPEN'
      },
      {
        id: 3,
        pimage: 'assets/ricebag.jpg',
        productName: '5kg Premium Rice',
        originalPrice: 450,
        discountedPrice: 360,
        currentParticipants: 10,
        maxParticipants: 10,
        status: 'Closed'
      }


    ];
    this.groupDeals = dummyDeals;
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