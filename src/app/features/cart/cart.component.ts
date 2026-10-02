import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({ standalone: true, imports: [CurrencyPipe, RouterLink], templateUrl: './cart.component.html' })
export class CartComponent { readonly cart = inject(CartService); readonly estimatedTax = computed(() => this.cart.total() * .09); readonly totalWithTax = computed(() => this.cart.total() + this.estimatedTax()); }
