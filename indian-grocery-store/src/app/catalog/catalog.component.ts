import { Component, Signal, signal } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductsService } from '../products.service';
import { IProduct } from '../product.model';
@Component({
  selector: 'store-catalog',
  imports: [ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  products!:Signal<IProduct[]>
  constructor(private productsService:ProductsService)
  {
  }
  ngOnInit(){
    this.products=this.productsService.getProducts()
  }
}
