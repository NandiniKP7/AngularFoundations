import { Component, input, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'store-cart-items',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.css',
})
export class CartItemComponent {
  product = input.required<IProduct>();
  availableInventory = signal(5);

  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }
  removeFromCart(){

  }
  getPricesClasses() {
    return {strikethrough:this.product().discount>0}
  }
}
