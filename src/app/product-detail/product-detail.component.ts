import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DiscountPipe } from '../discount.pipe';
import { OnlineserviceService } from '../onlineservice.service';
import { GroupBuyingService } from '../services/group-buying.service';
import { CartService } from '../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  reviews: any[] = [];
  relatedProducts: any[] = [];
  isGroupDeal: boolean = false;
  selectedQuantity: number = 1;

  incrementQuantity() {
    if (this.selectedQuantity < 10) {
      this.selectedQuantity++;
    }
  }

  decrementQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  highlights: string[] = [
    '1 Year Brand Warranty',
    '7 Days Replacement Policy',
    'Cash on Delivery Available',
    'GST Invoice Available',
    'Premium Build Quality',
    'Energy Efficient'
  ];

  specifications: any[] = [
    { key: 'Brand', value: 'BachatBuddy Premium' },
    { key: 'Model Name', value: 'Elite Series 2025' },
    { key: 'Weight', value: '1.2 kg' },
    { key: 'Material', value: 'High-Grade Composite' },
    { key: 'Warranty Summary', value: '1 Year Domestic Warranty' }
  ];

  bankOffers: string[] = [
    'Bank Offer 5% Cashback on BachatBuddy Axis Bank Card',
    'Special Price Get extra ₹1500 off (price inclusive of cashback/coupon)',
    'Partner Offer Buy this product and get upto ₹250 off on next purchase'
  ];

  ratingsDistribution = [
    { stars: 5, percentage: 75, count: 1205 },
    { stars: 4, percentage: 15, count: 240 },
    { stars: 3, percentage: 5, count: 80 },
    { stars: 2, percentage: 3, count: 45 },
    { stars: 1, percentage: 2, count: 30 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: OnlineserviceService,
    private groupBuyingService: GroupBuyingService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.queryParamMap.get('type');
    this.isGroupDeal = (type === 'group');

    if (id) {
      if (this.isGroupDeal) {
        this.loadGroupProduct(Number(id));
      } else {
        this.loadProduct(id);
      }
    }
  }

  loadGroupProduct(id: number) {
    this.groupBuyingService.getGroupBuyById(id).subscribe({
      next: (gp) => {
        this.product = {
          pid: String(gp.id),
          pname: gp.productName,
          price: gp.groupPrice,
          originalPrice: gp.originalPrice,
          qty: 1,
          pimage: gp.productImage,
          description: gp.description || 'Excellent group deal on BachatBuddy!',
          category: gp.category,
          progressPercentage: gp.progressPercentage,
          currentJoined: gp.currentJoined,
          totalNeeded: gp.totalNeeded
        };
        this.loadReviews();
        this.loadRelatedProducts();
      },
      error: (err) => {
        console.error('Error loading group product:', err);
        alert('Failed to load product details.');
      }
    });
  }

  loadProduct(id: string) {
    const p = this.service.getProductById(id);
    if (p) {
      this.product = {
        ...p,
        originalPrice: p.price // For consistent UI rendering
      };
      this.loadReviews();
      this.loadRelatedProducts();
    } else {
      console.warn('Product not found for ID:', id);
    }
  }

  private loadReviews() {
    this.reviews = [
      { user: 'Rahul', rating: 5, comment: 'Amazing sound quality!', date: 'Oct 2025' },
      { user: 'Sneha', rating: 4, comment: 'Good bass and fit, worth the price.', date: 'Oct 2025' },
      { user: 'Amit', rating: 3, comment: 'Battery backup could be better.', date: 'Sep 2025' }
    ];
  }

  private loadRelatedProducts() {
    this.relatedProducts = [
      { pid: 2, pname: 'Wireless Headphones', pimage: 'assets/images/headphones.png', price: 2999 },
      { pid: 3, pname: 'Bluetooth Speaker', pimage: 'assets/images/speaker.png', price: 1499 }
    ];
  }

  addToCart(product: any) {
    if (!this.product) return;

    this.cartService.addToCart({
      pid: Number(this.product.pid),
      pname: this.product.pname,
      price: this.product.price,
      qty: this.selectedQuantity,
      image: this.product.pimage
    });

    Swal.fire({
      title: 'Added to Cart!',
      text: `${this.product.pname} has been added to your cart.`,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Go to Cart',
      cancelButtonText: 'Continue Shopping'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/cart']);
      }
    });

  }


  buyNow(product: any) {
    const queryParams: any = { id: product.pid, qty: this.selectedQuantity };
    if (this.isGroupDeal) {
      queryParams.type = 'group';
    }
    this.router.navigate(['/buy'], { queryParams });
  }

  viewProduct(id: number) {
    // Update to use route param
    this.router.navigate(['/product-detail', id]).then(() => {
      // Reload current component with new ID (optional if router doesn't reload)
      this.loadProduct(String(id));
      window.scrollTo(0, 0);
    });
  }
}
