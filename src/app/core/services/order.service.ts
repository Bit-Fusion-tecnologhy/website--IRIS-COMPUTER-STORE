import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';
import { environment } from '../../../environments/environment';

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface Order {
  id?: string;
  userId?: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  delivery: 'priority' | 'express';
  modalidadEnvio?: string;
  shippingMethod?: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped';
  createdAt: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Crea una nueva orden de compra en json-server
   */
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  /**
   * Obtiene todas las órdenes asociadas a un usuario específico
   */
  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders?userId=${encodeURIComponent(userId)}`);
  }

  /**
   * Envía un mensaje de contacto a json-server
   */
  sendMessage(msg: ContactMessage): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(`${this.apiUrl}/messages`, msg);
  }

  /**
   * Obtiene una orden por su ID
   */
  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }
}
