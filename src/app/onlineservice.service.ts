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
      pimage: 'assets/images/saree.png',
      category: 'Wedding Bazar',
      description: 'Elegant silk saree with intricate embroidery, perfect for weddings.'
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
      description: 'A premium velvet box with silk ribbons, fresh roses, and a personalized heart card.'
    },
    {
      pid: 'g002',
      pname: 'Festive Birthday Hamper',
      price: 1599,
      qty: 25,
      pimage: 'assets/birthday-gift.png',
      category: 'Birthday',
      description: 'The ultimate celebration box filled with balloons, confetti, and gourmet treats.'
    },
    {
      pid: 'g003',
      pname: 'Professional Executive Set',
      price: 3200,
      qty: 15,
      pimage: 'assets/corporate-gift.png',
      category: 'Corporate',
      description: 'Sleek corporate gift set with a leather-bound notebook, premium pen, and matte mug.'
    },
    {
      pid: 'g004',
      pname: 'Handcrafted Heritage Basket',
      price: 1899,
      qty: 8,
      pimage: 'assets/homemade-gift.png',
      category: 'Homemade',
      description: 'A rustic basket with hand-knitted essentials, organic honey, and beeswax candles.'
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
}

export interface IProd {
  pid: string;
  pname: string;
  price: number;
  qty: number;
  pimage: string;
  category?: string;    // Added
  description?: string; // Added
}
