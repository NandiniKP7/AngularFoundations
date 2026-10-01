import { Component } from '@angular/core';
import { CartItemComponent } from '../cart-items/cart-items.component';
import { IProduct } from '../product.model';
import allProducts from '../products.json'
@Component({
  selector: 'store-cart',
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartItems:IProduct[]=[allProducts[3],allProducts[6]]
}
