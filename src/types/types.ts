export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  setItemQuantity: (id: number, quantity: number) => void; 
  isIntoCart?: (id: number) => boolean;
  removeCartItem: (id: number) => void;
}

export interface CardProps {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  qnt_reviews: number;
  avarage_rating: number;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  addItemToCart: (item: CartItem) => void;
  isIntoCart: (id: number) => boolean;
};

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';