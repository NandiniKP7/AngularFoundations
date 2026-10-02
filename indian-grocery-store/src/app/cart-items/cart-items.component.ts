import { Component, input, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'store-cart-items',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.css',
})
export class CartItemComponent {
  product = input.required<IProduct>();
  availableInventory = signal(5);
 constructor(private cartService:CartService){

 }
  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }
  removeFromCart(){
   this.cartService.removeItemsFromCart(this.product())
  }
  getPricesClasses() {
    return {strikethrough:this.product().discount>0}
  }
}
