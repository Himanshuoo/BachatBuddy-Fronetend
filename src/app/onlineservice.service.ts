import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlineserviceService {
  constructor(public h: HttpClient) { }

  // (Optional) backend endpoints for future integration
  // showproduct(): Observable<any> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.h.get('http://localhost:3000/show', httpOptions);
  // }
  // Addnewuser(data: any): Observable<any> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.h.post('http://localhost:3000/add', data, httpOptions);
  // }
  // userlogin(data: any): Observable<any> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.h.post('http://localhost:3000/login', data, httpOptions);
  // }

  // ✅ Local mock product data
  prod: IProd[] = [
    {
      pid: '1',
      pname: 'Bluetooth Earbuds',
      price: 1999,
      qty: 20,
      pimage: 'assets/images/earbuds.png',
      category: 'Electronics',
      description: 'Crystal-clear sound, noise cancellation, and 24h battery life.'
    },
    {
      pid: '2',
      pname: 'Wedding Saree',
      price: 2999,
      qty: 15,
      pimage: 'assets/sneakers.jpg', // Placeholder image from assets
      category: 'Wedding Bazar',
      description: 'Elegant silk saree with intricate embroidery, perfect for weddings.',
      joined: 6,
      needed: 10
    },
    {
      pid: 'w001',
      pname: 'Designer Sherwani',
      price: 8999,
      qty: 10,
      pimage: 'assets/tshirt.jpg', // Placeholder
      category: 'Wedding Bazar',
      description: 'Handcrafted premium sherwani with golden motifs and Dupion silk.',
      joined: 4,
      needed: 8
    },
    {
      pid: 'w002',
      pname: 'Kundan Jewelry Set',
      price: 4500,
      qty: 20,
      pimage: 'assets/watch.jpg', // Placeholder
      category: 'Wedding Bazar',
      description: 'Traditional kundan choker set with matching earrings and maang tikka.',
      joined: 12,
      needed: 15
    },
    {
      pid: 'w003',
      pname: 'Designer Bridal Lehenga',
      price: 15999,
      qty: 5,
      pimage: 'assets/images/gifts/homemade.png', // Placeholder
      category: 'Wedding Bazar',
      description: 'Exquisite red bridal lehenga with heavy zardosi work and velvet borders.',
      joined: 3,
      needed: 5
    },
    {
      pid: '3',
      pname: 'Organic Rice',
      price: 499,
      qty: 50,
      pimage: 'assets/images/rice.png',
      category: 'Groceries',
      description: 'Premium aged organic basmati rice for daily use.'
    },
    {
      pid: 'p001',
      pname: 'Smart TV',
      price: 15000,
      qty: 10,
      pimage: 'assets/tv.jpg',
      category: 'Electronics',
      description: '43-inch Full HD Smart LED TV with HDR support and smart features.'
    },
    {
      pid: 'p002',
      pname: 'Washing Machine',
      price: 12000,
      qty: 5,
      pimage: 'assets/washingmachine.jpg',
      category: 'Electronics',
      description: 'Fully automatic top-load washing machine with 5-star energy rating.'
    },
    {
      pid: 'p011',
      pname: 'Smartphone',
      price: 19000,
      qty: 8,
      pimage: 'assets/mobile.jpg',
      category: 'Electronics',
      description: 'Latest 5G smartphone with 128GB storage and 64MP camera.'
    },
    // ✅ Gifts Section Data
    {
      pid: 'g001',
      pname: 'Luxury Anniversary Box',
      price: 2499,
      qty: 10,
      pimage: 'assets/anniversary-gift.png',
      category: 'Anniversary',
      description: 'A premium velvet box with silk ribbons, fresh roses, and a personalized heart card.',
      joined: 5,
      needed: 10
    },
    {
      pid: 'g002',
      pname: 'Festive Birthday Hamper',
      price: 1599,
      qty: 25,
      pimage: 'assets/birthday-gift.png',
      category: 'Birthday',
      description: 'The ultimate celebration box filled with balloons, confetti, and gourmet treats.',
      joined: 15,
      needed: 20
    },
    {
      pid: 'g003',
      pname: 'Professional Executive Set',
      price: 3200,
      qty: 15,
      pimage: 'assets/corporate-gift.png',
      category: 'Corporate',
      description: 'Sleek corporate gift set with a leather-bound notebook, premium pen, and matte mug.',
      joined: 3,
      needed: 8
    },
    {
      pid: 'g004',
      pname: 'Handcrafted Heritage Basket',
      price: 1899,
      qty: 8,
      pimage: 'assets/homemade-gift.png',
      category: 'Homemade',
      description: 'A rustic basket with hand-knitted essentials, organic honey, and beeswax candles.',
      joined: 4,
      needed: 6
    }
  ];

  getProducts(): IProd[] {
    return this.prod;
  }

  // ✅ Get single product details by ID
  getProductById(id: any): IProd | undefined {
    // Loose equality to handle string/number mismatch
    return this.prod.find(p => p.pid == id);
  }

  // ✅ Increment the "joined" count for hybrid group deals
  incrementJoinedCount(id: string, count: number = 1): void {
    const p = this.getProductById(id);
    if (p && p.joined !== undefined) {
      p.joined += count;
      console.log(`Updated joined count for product ${id}: ${p.joined}`);
    }
  }
}

export interface IProd {
  pid: string;
  pname: string;
  price: number;
  qty: number;
  pimage: string;
  category?: string;
  description?: string;
  joined?: number;    // Added for group progress
  needed?: number;    // Added for group progress
}
