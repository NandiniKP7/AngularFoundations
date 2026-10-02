import { Component, input, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'store-product-details',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct>();
  availableInventory = signal(5);
constructor(private cartService:CartService){

}
  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }
  addToCart(event: MouseEvent) {
    setTimeout(() => this.availableInventory.update((p) => p - 1), 100);
    this.cartService.addItemsTocart(this.product())

  }
  getPricesClasses() {
    return {strikethrough:this.product().discount>0}
  }
}
