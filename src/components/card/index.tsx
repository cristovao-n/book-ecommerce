"use client";

import { Rate, Button, notification } from "antd";
import { ShoppingCart, Heart, HeartPlus } from "lucide-react";
import { CardProps, CartItem, NotificationType } from "@/src/types/types";
import { formatCurrency } from "@/src/utils/utils";
import { openNotificationWithIcon } from "@/src/utils/mesagesTemplate";
import { useEffect, useState } from "react";

export function Card(props: CardProps) {
  const [api, contextHolder] = notification.useNotification();
  const [notifyType, setNotifyType] = useState<NotificationType | null>(null);

  const {
    id,
    title,
    price,
    qnt_reviews,
    avarage_rating,
    image,
    favorites,
    toggleFavorite,
    addItemToCart,
    isIntoCart,
  } = props;

  const item: CartItem = {
    id,
    title,
    price,
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
      <div className="w-full aspect-square overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-fill" />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col min-h-21 max-h-full">
            <h3 className="font-bold text-xl line-clamp-2 text-gray-900">
              {title}
            </h3>
            <p className="text-lg text-gray-900">{formatCurrency(price)}</p>
          </div>
          <span
            onClick={() => toggleFavorite(title)}
            className="cursor-pointer bg-slate-100 p-3 rounded-full"
          >
            {favorites.includes(title) ? (
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
      </div>
    </div>
  );
}
