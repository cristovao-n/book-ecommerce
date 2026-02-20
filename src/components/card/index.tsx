"use client";

import { Rate, Button } from "antd";
import { ShoppingCart, Heart, HeartPlus } from "lucide-react";
import { useState } from "react";

type CardProps = {
  productName: string;
  productPrice: number;
  qnt_reviews: number;
  avarage_rating: number;
  productImage?: string;
};

export function Card(props: CardProps) {
  const {
    productName,
    productPrice,
    qnt_reviews,
    avarage_rating,
    productImage,
  } = props;

  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="m-1 w-full max-w-xs bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col min-h-21 max-h-full">
            <h3 className="font-bold text-xl line-clamp-2 text-gray-900">
              {productName}
            </h3>

            <p className="text-lg text-gray-900">
              R$ {productPrice.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <span
            onClick={() => toggleFavorite()}
            className="cursor-pointer bg-slate-100 p-3 rounded-full"
          >
            {isFavorited ? (
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
          block
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
}
