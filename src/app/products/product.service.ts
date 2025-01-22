import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, single, switchMap, tap, throwError } from 'rxjs';
import { Product, Result } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import { toSignal, toObservable } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  #http = inject(HttpClient);
  #errorService: HttpErrorService = inject(HttpErrorService);
  #reviewService = inject(ReviewService);

  selectedProductId = signal<number | undefined>(undefined);
  selectedProduct = new BehaviorSubject<number | undefined>(undefined);
  selectedProduct$ = this.selectedProduct.asObservable();

  // getProducts(): Observable<Product[]> {
  //   return this.#http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(console.log),
  //       catchError((error) => this.handleError(error))
  //     )
  // }

  private readonly productsResult$ = this.#http.get<Product[]>(this.productsUrl)
    .pipe(
      map((p) => ({ data: p } as Result<Product[]>)),
      tap(console.log),
      catchError((error) => of({ data: [], error: this.#errorService.formatError(error) } as Result<Product[]>))
    )

  private readonly productsResult = toSignal(this.productsResult$, { initialValue: ({ data: [] } as Result<Product[]>) });

  products = computed(() => this.productsResult().data);
  productsError = computed(() => this.productsResult().error);

  private foundProduct = computed(() => {
    const p = this.products();
    const id = this.selectedProductId();
    if (p && id) {
      return p.find((product: Product) => product.id === id)
    }
    return undefined;
  })

  private readonly productResult$ = toObservable(this.foundProduct).pipe(
    filter(Boolean),
    switchMap((product) => this.getProductWithReviews(product)),
    catchError((error) => of({ data: [], error: this.#errorService.formatError(error) } as Result<Product[]>)),
    map(p => ({ data: p } as Result<Product>))
  )

  // private readonly productResult$ = toObservable(this.foundProduct).pipe(
  //   filter(Boolean),
  //   switchMap((id: number) => {
  //     const productUrl = this.productsUrl + '/' + id;
  //     return this.#http.get<Product>(productUrl)
  //       .pipe(
  //         switchMap((product) => this.getProductWithReviews(product)),
  //         catchError((error) => of({ data: [], error: this.#errorService.formatError(error) } as Result<Product[]>))
  //       )
  //   }),
  //   map(p => ({ data: p } as Result<Product>))
  // )

  private productResult = toSignal(this.productResult$);
  product = computed(() => this.productResult()?.data);
  productError = computed(() => this.productResult()?.error);


  // readonly product$ = combineLatest([
  //   this.selectedProduct$,
  //   this.products$
  // ]).pipe(
  //   map(([selectedProductId, products]) =>
  //     products.find((product: Product) => product.id === selectedProductId)
  //   ),
  //   filter(Boolean),
  //   switchMap((product) => this.getProductWithReviews(product)),
  //   catchError((error) => this.handleError(error))
  // )


  // getProduct(id: number): Observable<Product> {
  //   const productUrl = this.productsUrl + '/' + id;
  //   return this.#http.get<Product>(productUrl)
  //     .pipe(
  //       tap(console.log),
  //       switchMap((product) => this.getProductWithReviews(product)),
  //       catchError((error) => this.handleError(error))
  //     )
  // }

  getProductWithReviews(product: Product): Observable<Product> {
    const { hasReviews, id } = product;
    if (hasReviews) {
      return this.#http.get<Review[]>(this.#reviewService.getReviewUrl(id)).pipe(
        map((reviews) => ({ ...product, reviews } as Product))
      )
    } else {
      return of(product);
    }
  }

  productSelected(id: number): void {
    this.selectedProduct.next(id);
    this.selectedProductId.set(id);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formatteMessage = this.#errorService.formatError(err);
    return throwError(() => formatteMessage);
  }

}
