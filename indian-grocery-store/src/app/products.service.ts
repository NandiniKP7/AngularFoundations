import { computed, Injectable } from '@angular/core';
import { IProduct } from './product.model';
import allProducts from './products.json'
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private resource :HttpResourceRef<IProduct[]|undefined>= httpResource(()=>'/api/products')
  getProducts(){
    return computed(()=> this.resource.value() ??[]);
  }
}
