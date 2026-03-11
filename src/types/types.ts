export interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantity: number;
  setItemQuantity: (id: number, quantity: number) => void; 
  isIntoCart?: (id: number) => boolean;
  removeCartItem: (id: number) => void;
}

export interface CardProps {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  imagem: string;
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
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';