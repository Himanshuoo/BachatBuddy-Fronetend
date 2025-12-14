import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineserviceService, IProd } from '../onlineservice.service';
import { GroupBuyingService } from '../services/group-buying.service';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  product?: IProd;
  totalPrice = 0;
  totalSavings = 0;

  addresses: any[] = [];

  selectedAddressIndex = -1;
  editMode = false;
  newAddress = '';
  selectedPaymentMode = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: OnlineserviceService,
    private groupBuyingService: GroupBuyingService,
    private addressService: AddressService
  ) { }

  ngOnInit(): void {
    const uid = sessionStorage.getItem('uid');
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

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveNewAddress() {
    if (this.newAddress.trim()) {
      this.addresses.push({
        name: 'User',
        phone: '9999999999',
        address: this.newAddress
      });
      this.newAddress = '';
      this.editMode = false;
      this.selectedAddressIndex = this.addresses.length - 1;
    }
  }

  selectPaymentMode(mode: string) {
    this.selectedPaymentMode = mode;
  }

  confirmOrder() {
    if (!this.selectedPaymentMode) {
      alert('Please select a payment mode before confirming.');
      return;
    }
    alert(`✅ Order placed successfully via ${this.selectedPaymentMode}!`);
    this.router.navigate(['/thank-you']);
  }
}
