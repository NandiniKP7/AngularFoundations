import { Component, signal } from '@angular/core';
import { CartItemComponent } from '../cart-items/cart-items.component';
import { CartService } from '../cart.service';
import { IProduct } from '../product.model';
@Component({
  selector: 'store-cart',
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {

  cartItems=signal<IProduct[]>([])
  
  constructor(private cartService:CartService){
    this.cartItems=this.cartService.cart
  }
}
