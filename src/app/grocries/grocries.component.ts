import { Component, OnInit } from '@angular/core';
import { GroupBuyingProduct } from '../models/group-buying.model';
import { GroupBuyingService } from '../services/group-buying.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grocries',
  templateUrl: './grocries.component.html',
  styleUrl: './grocries.component.css'
})
export class GrocriesComponent implements OnInit {

  popularProducts: GroupBuyingProduct[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private groupBuyingService: GroupBuyingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGroupBuyingProducts();
  }

  loadGroupBuyingProducts(): void {
    this.loading = true;

    this.groupBuyingService.getAllActiveGroupBuys().subscribe({
      next: (products) => {
        this.popularProducts = products.map(p => this.mapProductUI(p));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading group buying products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  /**
   * ✅ Enhance product with UI‑friendly fields
   */
  private mapProductUI(product: GroupBuyingProduct): GroupBuyingProduct {
  const progress = (product.currentJoined / product.totalNeeded) * 100;

  return {
    ...product,
    progressPercentage: Math.min(progress, 100),
    isGroupComplete: product.currentJoined >= product.totalNeeded,
    hasUserJoined: product.hasUserJoined ?? false,
    viewingNow: this.randomViewingCount(),
    timeLeft: product.expiresAt
      ? this.calculateTimeLeft(product.expiresAt)
      : 'Limited time',
    category: product.category ?? 'Groceries'
  };
}
  /**
   * ✅ Fake real‑time social proof (5–40 viewers)
   */
  private randomViewingCount(): number {
    return Math.floor(Math.random() * 35) + 5;
  }

  /**
   * ✅ Convert endTime → “3h left” / “2 days left”
   */
  private calculateTimeLeft(endTime: string | Date): string {
    if (!endTime) return 'Limited time';

    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) return 'Ends soon';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours}h left`;

    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m left`;
  }

  /**
   * ✅ Join Group Logic
   */
  joinGroup(productId: number): void {
    const userId = sessionStorage.getItem('uid');

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.groupBuyingService.joinGroupByIds(Number(userId), productId).subscribe({
      next: (response) => {
        alert(response.message);
        if (response.success) {
          this.loadGroupBuyingProducts(); // Refresh UI
        }
      },
      error: (err) => {
        console.error('Error joining group:', err);
        alert('Failed to join group. Please try again.');
      }
    });
  }

  /**
   * ✅ Navigate to deal details
   */
  openDeal(productId: number): void {
    this.router.navigate(['/group-buy', productId]);
  }

  /**
   * ✅ Share deal with friends
   */
  shareDeal(product: GroupBuyingProduct): void {
    if (navigator.share) {
      navigator.share({
        title: product.productName,
        text: `Join this group deal on BachatBuddy and save ₹${product.originalPrice - product.groupPrice}!`,
        url: window.location.href
      });
    } else {
      alert('Sharing is not supported on this device.');
    }
  }
}