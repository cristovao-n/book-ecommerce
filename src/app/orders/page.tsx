 "use client";

import { listOrders } from "@/src/lib/ordersRepo";
import { Order } from "@/src/types/types";
import { formatCurrency } from "@/src/utils/utils";
import { Button, Divider, Input, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/app/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerNameInput, setCustomerNameInput] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("currentCustomerName") ?? "";
  });
  const [searchedName, setSearchedName] = useState<string>("");
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role === "admin") {
      router.replace("/orders-management");
      return;
    }
    setOrders(listOrders());
  }, [role, router]);

  const handleSearch = () => {
    const trimmed = customerNameInput.trim();
    if (!trimmed) {
      setSearchedName("");
      return;
    }
    setSearchedName(trimmed);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currentCustomerName", trimmed);
    }
  };

  const filteredOrders =
    searchedName && orders.length
      ? orders.filter(
          (o) =>
            o.customerName?.trim().toLocaleLowerCase() ===
            searchedName.toLocaleLowerCase(),
        )
      : [];

  return (
    <main className="max-w-5xl mx-auto p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-semibold">Pedidos</h1>
        </div>

        <div className="bg-white shadow-md rounded p-4 flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">
            Informe o nome usado ao fazer o pedido
          </span>
          <Input
            placeholder="Seu nome"
            value={customerNameInput}
            onChange={(e) => {
              setCustomerNameInput(e.target.value);
            }}
            onPressEnter={handleSearch}
          />
          <div className="flex justify-end">
            <Button type="primary" onClick={handleSearch}>
              Pesquisar
            </Button>
          </div>
        </div>
      </div>

      {!searchedName && (
        <div className="bg-white shadow-md rounded p-4">
          <span>
            Nenhum pedido exibido. Informe e pesquise o mesmo nome utilizado ao
            finalizar a compra para visualizar seus pedidos.
          </span>
        </div>
      )}

      {searchedName && orders.length === 0 && (
        <div className="bg-white shadow-md rounded p-4">
          <span>Nenhum pedido registrado ainda.</span>
        </div>
      )}

      {searchedName && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {filteredOrders.length === 0 && (
            <div className="bg-white shadow-md rounded p-4">
              <span>Nenhum pedido encontrado para este nome.</span>
            </div>
          )}

          {filteredOrders.map((o) => (
            <div key={o.id} className="bg-white shadow-md rounded p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Pedido #{o.id}</span>
                  <Tag color="blue">{formatCurrency(o.total)}</Tag>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(o.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>

              <Divider className="my-3" />

              <div className="flex flex-col gap-2">
                {o.items.map((it) => (
                  <div
                    key={`${o.id}-${it.productId}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/products/${it.productId}`}
                        className="font-medium hover:text-blue-600 truncate block"
                      >
                        {it.nome}
                      </Link>
                      <span className="text-xs text-gray-600">
                        {it.quantity} x {formatCurrency(it.preco)}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(it.preco * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

