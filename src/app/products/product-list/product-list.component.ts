import { Component, inject } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent {
  pageTitle = 'Products';

  private productService = inject(ProductService);

  //Products
  products = this.productService.products;
  errorMessage = this.productService.productsError;
  // readonly products$ = this.productService.products$.pipe(
  //   catchError(err => {
  //     this.errorMessage = err;
  //     return EMPTY;
  //   })
  // );
    // .pipe()
    // .subscribe({
    //   next: products => this.products = products,
    //   error: err => this.errorMessage = err
    // })

  // ngOnInit(): void {
  //   this.productService.products$;
  //   this.sub = this.productService.getProducts()
  //     .pipe()
  //     .subscribe({
  //       next: products => this.products = products,
  //       error: err => this.errorMessage = err
  //     });
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  // Products
  //products: Product[] = [];

  // Selected product id to highlight the entry
  // selectedProductId: number = 0;
  selectedProductId = this.productService.selectedProductId;

  onSelected(productId: number): void {
    //this.selectedProductId = productId;
    this.productService.productSelected(productId);
  }
}
