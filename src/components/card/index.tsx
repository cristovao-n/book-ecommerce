"use client";

import { Rate, Button, notification, Popconfirm, Tag, Tooltip } from "antd";
import {
  ShoppingCart,
  Heart,
  HeartPlus,
  Pencil,
  Trash2,
  Tag as TagIcon,
  Tags as TagsIcon,
} from "lucide-react";
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
    descricao,
    categoria,
    tags,
    estoque,
    qnt_reviews,
    avarage_rating,
    imagem,
    favorites,
    toggleFavorite,
    addItemToCart,
    isIntoCart,
    onEdit,
    onDelete,
    disableCartActions,
  } = props;

  const item: CartItem = {
    id,
    nome,
    preco,
    quantity: 1,
  };

  const onAddItem = (id: number) => {
    if (disableCartActions) {
      return;
    }
    if (estoque <= 0) {
      setNotifyType("warning");
      return;
    }
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
        estoque <= 0 ? "Produto sem estoque!" : "Item já está no carrinho!",
      );
    }

    setNotifyType(null);
  }, [notifyType]);

  return (
    <div className="m-1 w-full max-w-xs bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
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

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start gap-2">
          <Link
            href={`/products/${id}`}
            className="flex flex-col min-h-21 max-h-full min-w-0 flex-1 hover:opacity-90"
          >
            <h3 className="font-bold text-xl line-clamp-2 text-gray-900">
              {nome}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1">
                <TagIcon className="w-3 h-3 text-gray-500" />
                <span className="font-medium">Categoria:</span>
              </span>
              <Tag className="m-0" color="blue">
                {categoria}
              </Tag>
            </div>
            {tags?.length ? (
              <div className="mt-1 flex flex-wrap items-center gap-1 text-xs">
                <TagsIcon className="w-3 h-3 text-gray-500 mr-1" />
                {tags.slice(0, 3).map((t) => (
                  <Tag key={t} className="m-0" color="geekblue">
                    {t}
                  </Tag>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <span className="mt-1 text-xs text-gray-500">Sem tags</span>
            )}
            {descricao && (
              <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                {descricao}
              </p>
            )}
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

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-600">Estoque: {estoque}</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(preco)}
            </p>
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

          {onEdit || onDelete ? (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                {!disableCartActions && (
                  <Tooltip title="Adicionar ao carrinho">
                    <Button
                      type="primary"
                      icon={<ShoppingCart size={16} />}
                      className="w-full h-10 flex items-center justify-center"
                      onClick={() => onAddItem(id)}
                      block
                    />
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Tooltip title="Editar">
                  <Button
                    disabled={!onEdit}
                    onClick={() => onEdit?.(id)}
                    icon={<Pencil size={16} />}
                  />
                </Tooltip>
                <Popconfirm
                  title="Excluir produto?"
                  description="Essa ação não pode ser desfeita."
                  okText="Excluir"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onDelete?.(id)}
                  disabled={!onDelete}
                >
                  <Tooltip title="Excluir">
                    <Button
                      danger
                      disabled={!onDelete}
                      icon={<Trash2 size={16} />}
                    />
                  </Tooltip>
                </Popconfirm>
              </div>
            </div>
          ) : (
            !disableCartActions && (
              <Tooltip title="Adicionar ao carrinho">
                <Button
                  type="primary"
                  icon={<ShoppingCart size={16} />}
                  className="w-full h-10 flex items-center justify-center"
                  onClick={() => onAddItem(id)}
                  block
                />
              </Tooltip>
            )
          )}
        </div>
      </div>
    </div>
  );
}
