import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { GroceriesListComponent } from './pages/groceries-list/groceries-list.component';
import { DealDetailComponent } from './pages/deal-detail/deal-detail.component';
import { PriceLadderComponent } from '../priceladder/priceladder.component';
import { DealCardComponent } from './components/deal-card/deal-card.component';


const routes: Routes = [
  { path: 'groceries', component: GroceriesListComponent },
  { path: 'groceries/deal/:id', component: DealDetailComponent }
];

@NgModule({
  declarations: [
    GroceriesListComponent,
    DealDetailComponent,
    DealCardComponent,
    PriceLadderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    // export if other modules should use groceries features
  ]
})
export class GroceriesModule {}
