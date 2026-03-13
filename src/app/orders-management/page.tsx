"use client";

import { listOrders } from "@/src/lib/ordersRepo";
import { Order, PaymentMethod, ShippingStatus } from "@/src/types/types";
import { formatCurrency } from "@/src/utils/utils";
import { Divider, Tag, Steps, Collapse } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CreditCardOutlined,
  DollarOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const ShippingStatusInfo = {
    [ShippingStatus.SENT]: { title: "Enviado", index: 0 },
    [ShippingStatus.ON_THE_WAY]: { title: "A caminho", index: 1 },
    [ShippingStatus.SHIPPING_ROUTE]: { title: "Em rota", index: 2 },
    [ShippingStatus.DELIVERED]: { title: "Entregue", index: 3 },
  };

  const PaymentMethodFormatter = {
    [PaymentMethod.CARD]: {
      title: "Cartão",
      color: "yellow",
      icon: <CreditCardOutlined />,
    },
    [PaymentMethod.PIX]: {
      title: "Pix",
      color: "green",
      icon: <DollarOutlined />,
    },
    [PaymentMethod.BOLETO]: {
      title: "Boleto",
      color: "purple",
      icon: <FileDoneOutlined />,
    },
  };

  const stepsItems = Object.values(ShippingStatusInfo).map((s) => ({
    title: s.title,
  }));

  useEffect(() => {
    setOrders(listOrders());
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gestão de Pedidos</h1>

        <Link href="/products" className="text-blue-600 hover:underline">
          Ver produtos
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white shadow p-6 text-center text-gray-600">
          Nenhum pedido registrado ainda.
        </div>
      ) : (
        <Collapse
          accordion
          ghost
          defaultActiveKey={orders[0]?.id}
          className="flex flex-col gap-4"
          items={orders.map((order) => ({
            key: order.id,

            label: (
              <div className="flex justify-between items-center w-full pr-4 py-3">
                {/* Left */}
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">
                    Pedido #{order.id}
                  </span>

                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                  <Tag
                    color={PaymentMethodFormatter[order.paymentMethod].color}
                    className="text-sm px-3 py-1 flex items-center gap-1"
                  >
                    {PaymentMethodFormatter[order.paymentMethod].icon}{" "}
                    {PaymentMethodFormatter[order.paymentMethod].title}
                  </Tag>

                  <Tag color="blue" className="text-sm px-3 py-1">
                    {formatCurrency(order.total)}
                  </Tag>
                </div>
              </div>
            ),

            children: (
              <div className="flex flex-col gap-5 pt-2">
                {/* Tracking */}
                <div className="px-2">
                  <Steps
                    current={ShippingStatusInfo[order.shippingStatus].index}
                    items={stepsItems}
                    size="small"
                  />
                </div>

                <Divider className="my-1" />

                {/* Products */}
                <div className="flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex flex-col">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-medium hover:text-blue-600"
                        >
                          {item.nome}
                        </Link>

                        <span className="text-gray-500 text-xs">
                          {item.quantity} × {formatCurrency(item.preco)}
                        </span>
                      </div>

                      <span className="font-semibold">
                        {formatCurrency(item.preco * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ),

            className: "bg-white shadow-lg",
          }))}
        />
      )}
    </main>
  );
}