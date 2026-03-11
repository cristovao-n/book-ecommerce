"use client";

import { CartItem } from "@/src/types/types";
import { InputNumber, InputNumberProps, Tooltip } from "antd";
import { CircleX } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/src/utils/utils";

export function ItemList(props: CartItem) {
  const { id, nome, preco, quantity, setItemQuantity, removeCartItem } = props;
  const onChange: InputNumberProps["onChange"] = (value) => {
    setItemQuantity(id, Number(value));
  };

  const sharedProps = {
    mode: "spinner" as const,
    min: 1,
    onChange,
    style: { width: 150 },
  };

  return (
    <div className="grid grid-cols-[1fr_150px_80px_24px] items-center gap-4 px-4 py-4 m-1 bg-white shadow-md rounded">
      <Link href={`/products/${id}`} className="font-bold min-w-0">
        <span className="block truncate hover:text-blue-500">{nome}</span>
      </Link>

      <InputNumber
        {...sharedProps}
        defaultValue={quantity}
        variant="filled"
        style={{ width: "100%" }}
        onChange={onChange}
      />

      <span className="font-semibold text-right">
        {formatCurrency(preco * quantity)}
      </span>

      <Tooltip title="Remover do carrinho">
        <CircleX
          onClick={() => removeCartItem(id)}
          className="cursor-pointer hover:text-red-500 shrink-0"
        />
      </Tooltip>
    </div>
  );
}
