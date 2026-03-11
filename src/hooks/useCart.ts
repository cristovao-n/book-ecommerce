"use client";

import { useEffect, useState } from "react";
import { CartItem } from "../types/types";

export function useCart() {
  const [cartItems, setCartItem] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("cartItems");
    setCartItem(storedData ? JSON.parse(storedData) : []);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems, isMounted]);

  const removeItem = (id: number, items: CartItem[]): CartItem[] => {
    return items.filter((i) => i.id !== id);
  };

  const setItemQuantity = (id: number, quantity: number) => {
    setCartItem((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const isIntoCart = (id: number): boolean => {
    return cartItems.some((i) => i.id === id);
  };

  const removeCartItem = (id: number) => {
    setCartItem(removeItem(id, cartItems));
  };

  const addItemToCart = (item: CartItem) => {
    setCartItem((prev) =>
      !prev.some((i) => i.id === item.id) ? [...prev, item] : prev,
    );
  };

  const clearCart = () => setCartItem([]);

  return {
    cartItems,
    isMounted,
    addItemToCart,
    setItemQuantity,
    isIntoCart,
    removeCartItem,
    clearCart,
  };
}
