"use client";

import { ItemList } from "@/src/components/itemList";
import { useCart } from "@/src/hooks/useCart";
import { formatCurrency } from "@/src/utils/utils";
import { Divider } from "antd";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cartItems, setItemQuantity, removeCartItem } = useCart();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(
      cartItems.reduce(
        (acc, current) => (acc += current.preco * current.quantity),
        0,
      ),
    );
  }, [cartItems]);

  return (
    <main className="max-w-5xl mx-auto">
      <section className="flex mt-2 items-center gap-4 px-4 py-4 m-1 bg-white shadow-md rounded">
        <h1>Carrinho</h1>
        <span>Total de items: {cartItems.length}</span>
        <Divider orientation="vertical" />
        <span>Total: {formatCurrency(total)}</span>
      </section>
      <Divider className="p-4" />
      <section>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <ItemList
              key={item.id}
              {...item}
              setItemQuantity={setItemQuantity}
              removeCartItem={removeCartItem}
            />
          ))
        ) : (
          <span>Carrinho vazio</span>
        )}
      </section>
    </main>
  );
}
