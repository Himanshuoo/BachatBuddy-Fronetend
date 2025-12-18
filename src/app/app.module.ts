import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BuyComponent } from './buy/buy.component';
import { ProductsComponent } from './products/products.component';
import { SearchComponent } from './search/search.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiscountPipe } from './discount.pipe';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { WeddingBazarComponent } from './wedding-bazar/wedding-bazar.component';
import { AddressComponent } from './address/address.component';
import { CouponsComponent } from './coupons/coupons.component';
import { GrocriesComponent } from './grocries/grocries.component';
import { ElectronicsComponent } from './electronics/electronics.component';
import { FashionsComponent } from './fashions/fashions.component';
import { BeautyComponent } from './beauty/beauty.component';
import { OrdersComponent } from './orders/orders.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    BuyComponent,
    ProductsComponent,
    SearchComponent,
    NotfoundComponent,
    FeedbackComponent,
    HomeComponent,
    WeddingBazarComponent,
    OrdersComponent,
    AddressComponent,
    CouponsComponent,
    GrocriesComponent,
    ElectronicsComponent,
    FashionsComponent,

    BeautyComponent,
    PaymentDialogComponent,
    ProductDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule, FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DiscountPipe
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],

  bootstrap: [AppComponent],


})

export class AppModule { }
