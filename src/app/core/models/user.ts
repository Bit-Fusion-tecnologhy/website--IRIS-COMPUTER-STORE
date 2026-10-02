export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}
