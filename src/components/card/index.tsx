"use client";

import { Rate, Button, notification, Popconfirm } from "antd";
import { ShoppingCart, Heart, HeartPlus } from "lucide-react";
import { CardProps, CartItem, NotificationType } from "@/src/types/types";
import { formatCurrency } from "@/src/utils/utils";
import { openNotificationWithIcon } from "@/src/utils/mesagesTemplate";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Card(props: CardProps) {
  const [api, contextHolder] = notification.useNotification();
  const [notifyType, setNotifyType] = useState<NotificationType | null>(null);

  const {
    id,
    nome,
    preco,
    qnt_reviews,
    avarage_rating,
    imagem,
    favorites,
    toggleFavorite,
    addItemToCart,
    isIntoCart,
    onEdit,
    onDelete,
  } = props;

  const item: CartItem = {
    id,
    nome,
    preco,
    quantity: 1,
  } as CartItem;

  const onAddItem = (id: number) => {
    if (isIntoCart(id)) {
      setNotifyType("warning");
      return;
    }
    addItemToCart(item);
    setNotifyType("success");
  };

  useEffect(() => {
    if (!notifyType) return;

    if (notifyType === "success") {
      openNotificationWithIcon(
        api,
        "success",
        "Sucesso",
        "Item adicionado ao carrinho!",
      );
    } else if (notifyType === "warning") {
      openNotificationWithIcon(
        api,
        "warning",
        "Aviso",
        "Item já está no carrinho!",
      );
    }

    setNotifyType(null);
  }, [notifyType]);

  return (
    <div className="m-1 w-full max-w-xs bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {contextHolder}
      <Link href={`/products/${id}`} className="block">
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={imagem}
            alt={nome}
            className="w-full h-full object-fill"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <Link
            href={`/products/${id}`}
            className="flex flex-col min-h-21 max-h-full min-w-0 flex-1 hover:opacity-90"
          >
            <h3 className="font-bold text-xl line-clamp-2 text-gray-900">
              {nome}
            </h3>
            <p className="text-lg text-gray-900">{formatCurrency(preco)}</p>
          </Link>
          <span
            onClick={() => toggleFavorite(id)}
            className="cursor-pointer bg-slate-100 p-3 rounded-full"
          >
            {favorites.includes(id) ? (
              <Heart className="text-red-500" fill="currentColor" />
            ) : (
              <HeartPlus />
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Rate
            disabled
            allowHalf
            value={avarage_rating}
            style={{ fontSize: "14px" }}
          />
          <span className="text-xs text-gray-600">({qnt_reviews})</span>
        </div>

        <Button
          type="primary"
          icon={<ShoppingCart size={16} />}
          className="w-full h-10"
          onClick={() => onAddItem(id)}
          block
        >
          Adicionar ao carrinho
        </Button>

        {(onEdit || onDelete) && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={!onEdit}
              onClick={() => onEdit?.(id)}
              block
            >
              Editar
            </Button>
            <Popconfirm
              title="Excluir produto?"
              description="Essa ação não pode ser desfeita."
              okText="Excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete?.(id)}
              disabled={!onDelete}
            >
              <Button danger disabled={!onDelete} block>
                Excluir
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
    </div>
  );
}
