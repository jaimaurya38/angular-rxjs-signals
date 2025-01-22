import { computed, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems().reduce((accQty, item) => accQty + item.quantity, 0));

  subTotal = computed(() => this.cartItems().reduce((accTotal, item) => accTotal + (item.quantity * item.product.price), 0));

  tax = computed(() => Math.round(this.subTotal() * 10) / 100);

  deliveryFee = computed<number>(() => this.subTotal() < 50 ? 5.99 : 0);

  totalPrice = computed(() => this.subTotal() + this.tax() + this.deliveryFee())

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== cartItem.product.id)
    );
  }
  
  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update(items =>
      items.map(item => item.product.id === cartItem.product.id ? { ...item, quantity } : item)
    );
  }

  addToCart(product: Product): void {
    this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
  }
}
