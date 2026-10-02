import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent {
  readonly wishlist = inject(WishlistService);
  readonly cart = inject(CartService);

  moveToCart(product: Product) {
    this.cart.add(product);
    this.wishlist.remove(product.id);
  }

  moveAllToCart() {
    for (const item of this.wishlist.items()) {
      this.cart.change(item, 1);
    }
    this.wishlist.clear();
    this.cart.open();
  }
}
