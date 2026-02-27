import { useEffect, useState } from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
}

export function useCart() {
  const [cartItens, setCartItem] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("cartItens");
    if (storedData) {
      setCartItem(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItens", JSON.stringify(cartItens));
  }, [cartItens]);

  const addItemToCart = (item: CartItem) => {
    setCartItem((prev) => 
        !prev.includes(item)
        ? [...prev, item]
        : prev
    );
  };

  return { cartItens, addItemToCart}
}
