import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { BuyComponent } from './buy/buy.component';
import { SearchComponent } from './search/search.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';
import { WeddingBazarComponent } from './wedding-bazar/wedding-bazar.component';

import { AuthGuard } from './auth.guard';
import { OrdersComponent } from './orders/orders.component';
import { AddressComponent } from './address/address.component';
import { CouponsComponent } from './coupons/coupons.component';
import { GrocriesComponent } from './grocries/grocries.component';
import { ElectronicsComponent } from './electronics/electronics.component';
import { FashionsComponent } from './fashions/fashions.component';
import { CartComponent } from './cart/cart.component';
import { DealsComponent } from './deals/deals.component';
import { BeautyComponent } from './beauty/beauty.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AssistantComponent } from './assistant/assistant.component';
import { GiftsComponent } from './gifts/gifts.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductsComponent },
  { path: 'buy', component: BuyComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'weddingBazar', component: WeddingBazarComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'address', component: AddressComponent, canActivate: [AuthGuard] },
  { path: 'coupons', component: CouponsComponent },
  { path: 'groceries', component: GrocriesComponent },
  { path: 'electronics', component: ElectronicsComponent },
  { path: 'fashion', component: FashionsComponent },
  { path: 'beauty', component: BeautyComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'deals', component: DealsComponent },
  // ✅ Protect product detail route
  { path: 'product-detail/:id', component: ProductDetailComponent, canActivate: [AuthGuard] }, // view details
  { path: 'buy/:id', component: BuyComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'assistant', component: AssistantComponent },
  { path: 'gifts', component: GiftsComponent },


  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }