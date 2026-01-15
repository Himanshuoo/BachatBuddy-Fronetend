import { Component, OnInit } from '@angular/core';
import { OnlineserviceService, IProd } from '../onlineservice.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-gifts',
    templateUrl: './gifts.component.html',
    styleUrls: ['./gifts.component.css']
})
export class GiftsComponent implements OnInit {
    allGifts: IProd[] = [];
    filteredGifts: IProd[] = [];
    selectedCategory: string = 'All';
    categories: string[] = ['All', 'Anniversary', 'Birthday', 'Corporate', 'Homemade'];

    constructor(
        private service: OnlineserviceService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadGifts();
    }

    loadGifts() {
        // We'll filter from all products where category is one of our gift categories
        const allProducts = this.service.getProducts();
        this.allGifts = allProducts.filter(p =>
            ['Anniversary', 'Birthday', 'Corporate', 'Homemade'].includes(p.category || '')
        );
        this.filterGifts('All');
    }

    filterGifts(category: string) {
        this.selectedCategory = category;
        if (category === 'All') {
            this.filteredGifts = [...this.allGifts];
        } else {
            this.filteredGifts = this.allGifts.filter(p => p.category === category);
        }
    }

    viewDetails(id: string) {
        this.router.navigate(['/product-detail', id]);
    }

    buyNow(id: string) {
        this.router.navigate(['/buy', id]);
    }
}
