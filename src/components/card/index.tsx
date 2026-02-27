"use client";

import { Rate, Button } from "antd";
import { ShoppingCart, Heart, HeartPlus } from "lucide-react";

interface CardProps {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  qnt_reviews: number;
  avarage_rating: number;
  favorites: string[];
  toggleFavorite: (id: string) => void;
};

export function Card(props: CardProps) {
  const {
    title,
    price,
    qnt_reviews,
    avarage_rating,
    image,
    favorites,
    toggleFavorite,
  } = props;

  return (
    <div className="m-1 w-full max-w-xs bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-fill"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col min-h-21 max-h-full">
            <h3 className="font-bold text-xl line-clamp-2 text-gray-900">
              {title}
            </h3>

            <p className="text-lg text-gray-900">
              R$ {price.toFixed(2).replace(".", ",")}
            </p>
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
          block
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
}
