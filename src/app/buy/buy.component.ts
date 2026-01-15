import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineserviceService, IProd } from '../onlineservice.service';
import { GroupBuyingService } from '../services/group-buying.service';
import { AddressService } from '../services/address.service';
import { OrdersService } from '../services/order.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  product?: IProd;
  totalPrice = 0;
  totalSavings = 0;
  quantity = 1;
  cartItems: any[] = [];
  isCartPurchase = false;

  userName: string = '';
  addresses: any[] = [];

  selectedAddressIndex = -1;
  selectedPaymentMode: 'UPI' | 'Card' | 'COD' | '' = '';
  showPaymentDialog = false;
  paymentDetails: any = null;
  isGroupDeal = false;

  get totalItems() {
    return this.cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: OnlineserviceService,
    private groupBuyingService: GroupBuyingService,
    private addressService: AddressService,
    private ordersService: OrdersService,
    private cartService: CartService
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
    const qty = this.route.snapshot.queryParamMap.get('qty');

    if (qty) {
      this.quantity = Number(qty);
    }

    this.isGroupDeal = (type === 'group');
    this.isCartPurchase = (type === 'cart');

    if (this.isCartPurchase) {
      this.loadCartProducts();
    } else if (id) {
      if (this.isGroupDeal) {
        this.loadGroupProduct(Number(id));
      } else {
        this.product = this.service.getProductById(id);
        if (this.product) {
          const baseSavings = Math.floor(this.product.price * 0.25); // 25% discount
          this.totalSavings = baseSavings * this.quantity;
          this.totalPrice = (this.product.price - baseSavings) * this.quantity;

          // For single item, we can still use cartItems for uniform template rendering
          this.cartItems = [{
            pname: this.product.pname,
            pimage: this.product.pimage,
            price: this.product.price,
            qty: this.quantity
          }];
        }
      }
    }
  }

  loadCartProducts() {
    this.cartItems = this.cartService.getCartItems().map(item => ({
      pname: item.pname,
      pimage: item.image,
      price: item.price,
      qty: item.qty
    }));

    // Calculate totals for cart
    this.totalSavings = this.cartItems.reduce((acc, item) => acc + (Math.floor(item.price * 0.25) * item.qty), 0);
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + ((item.price - Math.floor(item.price * 0.25)) * item.qty), 0);
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
          qty: this.quantity,
          pimage: gp.productImage
        };
        this.totalSavings = (gp.originalPrice - gp.groupPrice) * this.quantity;
        this.totalPrice = gp.groupPrice * this.quantity;

        // Populate cartItems for uniform summary processing
        this.cartItems = [{
          pname: gp.productName,
          pimage: gp.productImage,
          price: gp.groupPrice,
          qty: this.quantity
        }];
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



  openPaymentDialog(mode: 'UPI' | 'Card') {
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
      productName: this.isCartPurchase ? `${this.cartItems[0].pname} + ${this.cartItems.length - 1} more` : this.product?.pname,
      imageUrl: this.isCartPurchase ? this.cartItems[0].pimage : this.product?.pimage,
      originalPrice: this.totalPrice + this.totalSavings,
      total: this.totalPrice,
      savings: this.totalSavings,
      quantity: this.isCartPurchase ? this.totalItems : this.quantity,
      items: this.cartItems,
      paymentMode: this.selectedPaymentMode,
      paymentDetails: this.paymentDetails,
      shippingAddress: selectedAddr,
      status: 'Pending',
      date: new Date()
    };

    console.log('Placing order:', orderPayload);

    this.ordersService.createOrder(uid, orderPayload).subscribe({
      next: (res) => {
        console.log('Order Success:', res);

        // Clear cart if it was a cart purchase
        if (this.isCartPurchase) {
          this.cartService.clearCart();
        }

        // If it's a group deal, also join the group with the specified quantity
        if (this.isGroupDeal && this.product?.pid) {
          this.groupBuyingService.joinGroupByIds(Number(uid), Number(this.product.pid), this.quantity).subscribe({
            next: (joinRes) => console.log('Group joined successfully:', joinRes),
            error: (err) => console.error('Failed to update group join count:', err)
          });
        }

        alert(`✅ Order placed successfully via ${this.selectedPaymentMode}!`);
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Order Failed:', err);
        alert('Failed to place order. Please try again.');
      }
    });
  }


}
