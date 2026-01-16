import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupBuyingService } from '../services/group-buying.service';
import { GroupBuyingProduct } from '../models/group-buying.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  popularProducts: GroupBuyingProduct[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private groupBuyingService: GroupBuyingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadGroupBuyingProducts();
  }

  loadGroupBuyingProducts(): void {
    this.loading = true;
    this.groupBuyingService.getAllActiveGroupBuys().subscribe({
      next: (products) => {
        this.popularProducts = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading group buying products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  joinGroup(product: GroupBuyingProduct): void {
    const userId = sessionStorage.getItem('uid');

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (product.hasUserJoined) {
      if (!confirm('You have already joined this group. Do you want to join again?')) {
        alert('You have already added to this group');
        return;
      }
    }

    // Navigate to Buy page with group type
    this.router.navigate(['/buy', product.id], { queryParams: { type: 'group' } });
  }

  /**
   * ✅ Navigate to deal details
   */
  viewDetails(productId: any): void {
    this.router.navigate(['/product-detail', productId], { queryParams: { type: 'group' } });
  }
}