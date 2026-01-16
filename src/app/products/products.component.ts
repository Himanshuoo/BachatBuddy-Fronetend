import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../services/cart.service';
import Swal from 'sweetalert2';
import { OnlineserviceService } from '../onlineservice.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  prod: any[] = [];
  categories = ['All', 'Groceries', 'Electronics', 'Fashion', 'Beauty', 'Wedding Bazar', 'Gifts'];
  selectedCategory = 'All';
  filteredProducts: any[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private onlineService: OnlineserviceService
  ) { }

  ngOnInit(): void {
    this.prod = this.onlineService.getProducts();
    this.filteredProducts = this.prod;
  }

  filterByCategory(cat: string) {
    this.selectedCategory = cat;
    this.filteredProducts = cat === 'All' ? this.prod : this.prod.filter(p => p.category === cat);
  }

  addToCart(item: any) {
    this.cartService.addToCart({
      pid: item.pid,
      pname: item.pname,
      price: item.price,
      image: item.pimage,
      qty: 1
    });

    Swal.fire({
      title: 'Added to Cart!',
      text: `${item.pname} has been added to your cart.`,
      icon: 'success',
      confirmButtonText: 'Go to Cart'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.router.navigate(['/cart']);
      }
    });
  }

  viewDetails(item: any) {
    const queryParams: any = {};
    if (item.needed) {
      queryParams.type = 'group';
    }
    this.router.navigate(['/product-detail', item.pid], { queryParams });
  }

  buyNow(item: any) {
    const queryParams: any = {};
    if (item.needed) {
      queryParams.type = 'group';
    }
    this.router.navigate(['/buy', item.pid], { queryParams });
  }
}
