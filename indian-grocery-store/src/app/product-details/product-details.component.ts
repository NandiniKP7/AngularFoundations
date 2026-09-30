import { Component, input, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'store-product-details',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct>();
  availableInventory = signal(5);

  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }
  addToCart(event: MouseEvent) {
    setTimeout(() => this.availableInventory.update((p) => p - 1), 100);
    console.log(event);
  }
  getPricesClasses() {
    return {strikethrough:this.product().discount>0}
  }
}
