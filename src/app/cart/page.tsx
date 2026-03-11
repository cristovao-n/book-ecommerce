"use client";

import { ItemList } from "@/src/components/itemList";
import { useCart } from "@/src/hooks/useCart";
import { createOrder } from "@/src/lib/ordersRepo";
import { decrementInventory, ensureSeededProducts } from "@/src/lib/productsRepo";
import { formatCurrency } from "@/src/utils/utils";
import { Button, Divider, notification } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cartItems, setItemQuantity, removeCartItem, clearCart } = useCart();
  const [total, setTotal] = useState<number>(0);
  const [isPlacing, setIsPlacing] = useState(false);
  const router = useRouter();

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
        <div className="flex-1" />
        <Button
          type="primary"
          disabled={!cartItems.length}
          loading={isPlacing}
          onClick={() => {
            try {
              setIsPlacing(true);
              ensureSeededProducts();

              decrementInventory(
                cartItems.map((i) => ({
                  productId: i.id,
                  quantity: i.quantity,
                })),
              );

              createOrder({
                createdAt: new Date().toISOString(),
                total,
                items: cartItems.map((i) => ({
                  productId: i.id,
                  nome: i.nome,
                  preco: i.preco,
                  quantity: i.quantity,
                })),
              });

              clearCart();
              notification.success({
                title: "Pedido realizado",
                description: "Seu pedido foi registrado com sucesso.",
                placement: "bottomRight",
              });
              router.push("/orders");
            } catch (e) {
              notification.error({
                title: "Não foi possível finalizar",
                description:
                  e instanceof Error ? e.message : "Erro ao processar o pedido.",
                placement: "bottomRight",
              });
            } finally {
              setIsPlacing(false);
            }
          }}
        >
          Finalizar compra
        </Button>
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
