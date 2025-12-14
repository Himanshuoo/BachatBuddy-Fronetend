import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineserviceService, IProd } from '../onlineservice.service';
import { GroupBuyingService } from '../services/group-buying.service';
import { AddressService } from '../services/address.service';
import { OrdersService } from '../services/order.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  product?: IProd;
  totalPrice = 0;
  totalSavings = 0;

  userName: string = '';
  addresses: any[] = [];

  selectedAddressIndex = -1;
  selectedPaymentMode = '';
  showPaymentDialog = false;
  paymentDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: OnlineserviceService,
    private groupBuyingService: GroupBuyingService,
    private addressService: AddressService,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    const uid = sessionStorage.getItem('uid');
    this.userName = sessionStorage.getItem('username') || 'Valued Customer';

    if (uid) {
      this.loadAddresses(uid);
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    const idQuery = this.route.snapshot.queryParamMap.get('id');
    const id = idParam || idQuery;
    const type = this.route.snapshot.queryParamMap.get('type');

    if (id) {
      if (type === 'group') {
        this.loadGroupProduct(Number(id));
      } else {
        this.product = this.service.getProductById(id);
        if (this.product) {
          this.totalSavings = Math.floor(this.product.price * 0.25); // 25% discount
          this.totalPrice = this.product.price - this.totalSavings;
        }
      }
    }
  }

  loadAddresses(uid: string) {
    this.addressService.getAddresses(uid).subscribe({
      next: (data) => {
        this.addresses = data || [];
        const defaultIndex = this.addresses.findIndex(a => a.isDefault);
        if (defaultIndex !== -1) {
          this.selectedAddressIndex = defaultIndex;
        } else if (this.addresses.length > 0) {
          this.selectedAddressIndex = 0;
        }
      },
      error: (e) => console.error('Failed to load addresses', e)
    });
  }

  loadGroupProduct(id: number) {
    this.groupBuyingService.getGroupBuyById(id).subscribe({
      next: (gp) => {
        this.product = {
          pid: String(gp.id),
          pname: gp.productName,
          price: gp.groupPrice,
          qty: 1,
          pimage: gp.productImage
        };
        this.totalSavings = gp.originalPrice - gp.groupPrice;
        this.totalPrice = gp.groupPrice;
      },
      error: (err) => {
        console.error('Error loading group product:', err);
        alert('Failed to load product details.');
      }
    });
  }

  selectAddress(index: number) {
    this.selectedAddressIndex = index;
  }

  addNewAddress() {
    this.router.navigate(['/address'], { queryParams: { returnUrl: this.router.url } });
  }



  openPaymentDialog(mode: string) {
    this.selectedPaymentMode = mode;
    this.showPaymentDialog = true;
  }

  onPaymentConfirmed(details: any) {
    this.paymentDetails = details;
    this.showPaymentDialog = false;
    // Keep the payment mode selected
  }

  cancelPaymentDialog() {
    this.showPaymentDialog = false;
    this.selectedPaymentMode = ''; // Deselect if cancelled
    this.paymentDetails = null;
  }

  confirmOrder() {
    if (this.selectedAddressIndex < 0) {
      alert('Please select a delivery address to proceed.');
      return;
    }
    if (!this.selectedPaymentMode || !this.paymentDetails) {
      alert('Please enter payment details.');
      return;
    }

    const uid = sessionStorage.getItem('uid');
    // ... existing login check ...
    if (!uid) {
      alert('User not logged in!');
      this.router.navigate(['/login']);
      return;
    }

    const selectedAddr = this.addresses[this.selectedAddressIndex];

    const orderPayload = {
      productName: this.product?.pname,
      imageUrl: this.product?.pimage,
      originalPrice: this.totalPrice + this.totalSavings,
      total: this.totalPrice,
      savings: this.totalSavings,
      quantity: 1,
      paymentMode: this.selectedPaymentMode,
      paymentDetails: this.paymentDetails, // Include details
      shippingAddress: selectedAddr,
      status: 'Pending',
      date: new Date()
    };

    // ... existing service call ...
    console.log('Placing order:', orderPayload);

    this.ordersService.createOrder(uid, orderPayload).subscribe({
      next: (res) => {
        console.log('Order Success:', res);
        alert(`✅ Order placed successfully via ${this.selectedPaymentMode}!`);
        this.router.navigate(['/thank-you']);
      },
      error: (err) => {
        console.error('Order Failed:', err);
        alert('Failed to place order. Please try again.');
      }
    });
  }


}
