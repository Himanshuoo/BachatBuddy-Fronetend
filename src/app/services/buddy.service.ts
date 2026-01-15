import { Injectable } from '@angular/core';
import { OnlineserviceService, IProd } from '../onlineservice.service';
import { GroupBuyingService } from './group-buying.service';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BuddyService {

    constructor(
        private productService: OnlineserviceService,
        private groupService: GroupBuyingService
    ) { }

    /**
     * Get application data to provide context to the assistant
     */
    getKnowledgeBase(): Observable<any> {
        return forkJoin({
            products: of(this.productService.getProducts()),
            deals: this.groupService.getAllActiveGroupBuys().pipe(
                catchError(() => of([]))
            )
        });
    }

    /**
     * Simple logic to generate a response based on query and knowledge base
     */
    getResponse(query: string): Observable<string> {
        const q = query.toLowerCase();

        return this.getKnowledgeBase().pipe(
            map(data => {
                const products: IProd[] = data.products || [];
                const deals: any[] = data.deals || [];

                // 1. Check for specific categories
                const categories = ['electronics', 'groceries', 'fashion', 'beauty', 'wedding'];
                const foundCategory = categories.find(cat => q.includes(cat));

                if (foundCategory) {
                    const categoryProducts = products.filter(p => p.category?.toLowerCase() === foundCategory);
                    if (categoryProducts.length > 0) {
                        let resp = `I found some great items in **${foundCategory}**: <br><br>`;
                        categoryProducts.forEach(p => {
                            resp += `🔸 **${p.pname}**: ₹${p.price}<br>`;
                        });
                        return resp + `<br>Anything else I can help you with?`;
                    }
                }

                // 2. Check for deals
                if (q.includes('deal') || q.includes('offer') || q.includes('discount') || q.includes('sale')) {
                    if (deals.length > 0) {
                        let resp = `We have active **Group Deals** where you can save a lot! 🔥<br><br>`;
                        deals.forEach(d => {
                            const name = d.productName || d.pname || d.name || 'Special Product';
                            const price = d.groupPrice || d.price;
                            resp += `💎 **${name}**: Join for a lower price of ₹${price}!<br>`;
                        });
                        return resp + `<br>You can find these in the "Hot Deals" or "Groceries" sections.`;
                    }
                    return `I don't see any active group deals right now, but check our "Offers" section for regular discounts!`;
                }

                // 3. Check for specific products
                const foundProduct = products.find(p => q.includes(p.pname.toLowerCase()));
                if (foundProduct) {
                    return `Yes! We have **${foundProduct.pname}** for ₹${foundProduct.price}. It's currently in stock (${foundProduct.qty} left). Would you like to see it?`;
                }

                // 4. Greetings
                if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
                    return `Hello! I'm Buddy, your shopping assistant. 🛍️ How can I help you today? You can ask me about products, deals, or categories!`;
                }

                if (q.includes('thank')) {
                    return `You're very welcome! Happy shopping! 🎁`;
                }

                // 5. Default
                return `I'm not exactly sure about that, but I can help you find products or explain our group deals! Try asking "What electronics do you have?" or "Show me deals".`;
            })
        );
    }
}
