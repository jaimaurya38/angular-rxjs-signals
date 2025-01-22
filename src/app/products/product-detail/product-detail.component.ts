import { Component, computed, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent {
  //sub!: Subscription;
  private productService = inject(ProductService);
  #cartService = inject(CartService);
  // ngOnChanges(changes: SimpleChanges): void {
  //   const id = changes['productId'].currentValue;
  //   if (id) {
  //     this.sub = this.productService.getProduct(id).subscribe(
  //       {
  //         next: (product: Product) => {
  //           this.product = product;
  //         },
  //         error: err => this.errorMessage = err
  //       })
  //   }
  // }
  //@Input() productId: number = 0;
  // errorMessage = '';

  // Product to display
  //product: Product | null = null;
  // product$ = this.productService.product$
  //   .pipe(
  //     catchError((err) => {
  //       this.errorMessage = err;
  //       return EMPTY;
  //     })
  //   );

  product = this.productService.product;
  productError = this.productService.productError;

  // Set the page title
  //pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = computed(() => this.product()
    ? `Product Detail for: ${this.product()?.productName}`
    : 'Product Detail');

  addToCart(product: Product) {
    this.#cartService.addToCart(product);
  }

  // ngOnDestroy(): void {
  //   if (!this.sub) return;
  //   this.sub.unsubscribe();
  // }
}
