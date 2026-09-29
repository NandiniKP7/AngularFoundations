import { Component } from '@angular/core';
import {IProduct} from '../product.model'

@Component({
  selector: 'store-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product:IProduct;
  availableInventory=5;
  constructor(){
    this.product={
      id: 9,
      name: "Rice",
      description:'Everyday rice suitable for curries, dal, pulao, and other Indian meals.',
      imageName: "BasmatiRice.png",
      category: "Grains",
      price: 12.99,
      discount: 0,
    }
  }
  getImageUrl(product:IProduct){
    return "/assets/"+product.imageName

  }
  addToCart(product:IProduct, event:MouseEvent)
  {
    setTimeout(()=>this.availableInventory=2, 3000);
    product.name+='addedtoCart'
    console.log(event)
  }

}
