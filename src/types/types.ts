export interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantity: number;
}

export interface CartItemRowProps extends CartItem {
  setItemQuantity: (id: number, quantity: number) => void;
  removeCartItem: (id: number) => void;
}

export interface CardProps {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  imagem: string;
  categoria: string;
  tags: string[];
  estoque: number;
  qnt_reviews: number;
  avarage_rating: number;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  addItemToCart: (item: CartItem) => void;
  isIntoCart: (id: number) => boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  preco: number;
  categoria: string;
  tags: string[];
  estoque: number;
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface OrderLine {
  productId: number;
  nome: string;
  preco: number;
  quantity: number;
}

export interface Order {
  id: number;
  createdAt: string; // ISO
  total: number;
  items: OrderLine[];
}

export interface CheckoutItem {
  nome: string;
  preco: number;
  quantity: number;
  descricao?: string;
  imagem?: string;
}

export interface SessionData {
  status: string;
  customerEmail?: string;
  customerName?: string;
  amountTotal?: number;
  lineItems?: {
    description: string | null;
    amount_total: number;
    quantity: number | null;
  }[];
}
